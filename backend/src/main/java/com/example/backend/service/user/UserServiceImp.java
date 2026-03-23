package com.example.backend.service.user;

import com.example.backend.dao.user.RoleRepository;
import com.example.backend.dao.user.UserRepository;
import com.example.backend.dto.request.user.ChangeAvatarDTO;
import com.example.backend.dto.request.user.ChangePasswordDTO;
import com.example.backend.dto.request.user.UpdateProfileDTO;
import com.example.backend.entity.notification.Notification;
import com.example.backend.entity.user.Role;
import com.example.backend.entity.user.User;
import com.example.backend.dto.response.auth.JwtResponse;
import com.example.backend.dto.request.auth.LoginRequest;
import com.example.backend.security.jwt.JwtService;
import com.example.backend.service.UploadImage.UploadImageService;
import com.example.backend.service.email.EmailService;
import com.example.backend.service.util.Base64ToMultipartFileConverter;
import org.springframework.web.multipart.MultipartFile;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

@Service
public class UserServiceImp implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UploadImageService uploadImageService;

    public ResponseEntity<?> register(User user) {
        // Kiểm tra username đã tồn tại chưa
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(new Notification("Username đã tồn tại."));
        }

        // Kiểm tra email
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(new Notification("Email đã tồn tại."));
        }

        // Mã hoá mật khẩu
        String encodePassword = passwordEncoder.encode(user.getPassword());
        // Set mật khẩu đã mã hoá
        user.setPassword(encodePassword);

        // Set ảnh đại diện
        user.setAvatar("");

        // Tạo mã kích hoạt cho người dùng
        // Mã kích hoạt là mã được gửi đến email của người dùng để kích hoạt tài khoản
        user.setActivationCode(generateActivationCode());
        // Set trạng thái kích hoạt là false
        user.setEnabled(false);

        // Cho role mặc định là CUSTOMER
        List<Role> roleList = new ArrayList<>();
        roleList.add(roleRepository.findByNameRole("CUSTOMER"));
        user.setListRoles(roleList);

        // Lưu user vào database
        userRepository.save(user);
        // Gửi email cho người dùng để kích hoạt
        sendEmailActivation(user.getEmail(), user.getActivationCode());

        return ResponseEntity.ok("Đăng ký thành công!");
    }

    // 👇 Thêm user bởi Admin
    public ResponseEntity<?> addUserByAdmin(User user) {
        // Kiểm tra username đã tồn tại chưa
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(new Notification("Username đã tồn tại."));
        }

        // Kiểm tra email
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(new Notification("Email đã tồn tại."));
        }

        // Mã hoá mật khẩu
        String encodePassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodePassword);

        // Set ảnh đại diện
        user.setAvatar("");

        // Tạo mã kích hoạt
        user.setActivationCode(generateActivationCode());
        // Chưa kích hoạt
        user.setEnabled(false);

        // Cho role mặc định là CUSTOMER
        List<Role> roleList = new ArrayList<>();
        roleList.add(roleRepository.findByNameRole("CUSTOMER"));
        user.setListRoles(roleList);

        // Lưu user vào database
        userRepository.save(user);

        // Gửi email xác nhận
        sendEmailActivation(user.getEmail(), user.getActivationCode());

        return ResponseEntity.ok(new Notification("Người dùng được tạo thành công! Email xác nhận đã được gửi."));
    }

    // 👇 Cập nhật user bởi Admin
    public ResponseEntity<?> updateUserByAdmin(int userId, User updateData) {
        // Tìm user theo ID
        User existingUser = userRepository.findById(userId).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.badRequest().body(new Notification("Người dùng không tồn tại."));
        }

        // Cập nhật các field
        if (updateData.getEmail() != null && !updateData.getEmail().isEmpty()) {
            // Kiểm tra email không bị trùng (ngoại trừ user hiện tại)
            if (!existingUser.getEmail().equals(updateData.getEmail()) && 
                userRepository.existsByEmail(updateData.getEmail())) {
                return ResponseEntity.badRequest().body(new Notification("Email đã tồn tại."));
            }
            existingUser.setEmail(updateData.getEmail());
        }

        if (updateData.getFirstName() != null && !updateData.getFirstName().isEmpty()) {
            existingUser.setFirstName(updateData.getFirstName());
        }

        if (updateData.getLastName() != null && !updateData.getLastName().isEmpty()) {
            existingUser.setLastName(updateData.getLastName());
        }

        if (updateData.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(updateData.getPhoneNumber());
        }

        if (updateData.getDateOfBirth() != null) {
            existingUser.setDateOfBirth(updateData.getDateOfBirth());
        }

        if (updateData.getGender() != '\0') {
            existingUser.setGender(updateData.getGender());
        }

        if (updateData.getDeliveryAddress() != null) {
            existingUser.setDeliveryAddress(updateData.getDeliveryAddress());
        }

        // Cập nhật password nếu có
        if (updateData.getPassword() != null && !updateData.getPassword().isEmpty()) {
            String encodePassword = passwordEncoder.encode(updateData.getPassword());
            existingUser.setPassword(encodePassword);
        }

        // Lưu user đã cập nhật
        userRepository.save(existingUser);

        return ResponseEntity.ok(new Notification("Cập nhật người dùng thành công."));
    }

    private String generateActivationCode() {
        return UUID.randomUUID().toString();
    }

    //Gửi email kích hoạt tài khoản
    private void sendEmailActivation(String email, String activationCode) {
        String endpointFE = "http://localhost:3000";
        String url = endpointFE + "/active/" + email + "/" + activationCode;
        String subject = "Kích hoạt tài khoản";
        String message = "Cảm ơn bạn đã là thành viên của chúng tôi. Vui lòng kích hoạt tài khoản!: <br/> Mã kích hoạt: <strong>"+ activationCode +"<strong/>";
        message += "<br/> Click vào đây để <a href="+ url +">kích hoạt</a>";
        try {
            //Gửi email tới người dùng
            emailService.sendMessage("de180352vubinhminh@gmail.com", email, subject, message);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    // Kích hoạt tài khoản
    public ResponseEntity<?> activeAccount(String email, String activationCode) {
        // Tìm kiếm user theo email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body(new Notification("Người dùng không tồn tại!"));
        }
        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body(new Notification("Tài khoản đã được kích hoạt"));
        }
        // Kiểm tra mã kích hoạt
        if (user.getActivationCode().equals(activationCode)) {
            // Set trạng thái kích hoạt là true
            user.setEnabled(true);
            userRepository.save(user);
        } else {
            return ResponseEntity.badRequest().body(new Notification("Mã kích hoạt không chính xác!"));
        }
        return ResponseEntity.ok(new Notification("Kích hoạt thành công"));
    }

    //Chức năng đăng nhập cho người dùng 
    public ResponseEntity<?> authenticate(LoginRequest loginRequest){
        // Xử lý xác thực người dùng
        try{
            // authentication sẽ giúp ta lấy dữ liệu từ db để kiểm tra
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            // Nếu xác thực thành công
            if (authentication.isAuthenticated()) {
                // Kiểm tra người dùng có được kích hoạt hay không
                User user = userRepository.findByUsername(loginRequest.getUsername());
                if (user == null) {
                    return ResponseEntity.badRequest().body("Người dùng không tồn tại!");
                }
                if (!user.isEnabled()) {
                    return ResponseEntity.badRequest().body("Tài khoản đã bị khóa hoặc chưa được kích hoạt!");
                }
                // Tạo token cho người dùng
                final String jwtToken = jwtService.generateToken(loginRequest.getUsername());
                return ResponseEntity.ok(new JwtResponse(jwtToken));
            }
        } catch (AuthenticationException e) {
            return ResponseEntity.badRequest().body("Tên đăng nhập hoặc mật khẩu không đúng!");
        }
        return ResponseEntity.badRequest().body("Xác thực không thành công");
    }


    //Quên mật khẩu 
    public ResponseEntity<?> forgotPassword(String email) {
        try{
            //Tìm kiếm người dùng theo email
            User user = userRepository.findByEmail(email);

            System.out.println(user);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // Đổi mật khẩu cho user (dùng mật khẩu random)
            String passwordTemp = generateTemporaryPassword();
            user.setPassword(passwordEncoder.encode(passwordTemp));
            userRepository.save(user);

            // Gửi email để nhận mật khẩu
            sendEmailForgotPassword(user.getEmail(), passwordTemp);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok().build();
    }

    //Gửi email quên mật khẩu 
    private void sendEmailForgotPassword(String email, String password) {
        String subject = "Reset mật khẩu";
        String message = "Mật khẩu tạm thời của bạn là: <strong>" + password + "</strong>";
        message += "<br/> <span>Vui lòng đăng nhập và đổi lại mật khẩu của bạn</span>";
        try {
            //Gửi email tới người dùng
            emailService.sendMessage("de180352vubinhminh@gmail.com", email, subject, message);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    
    private String generateTemporaryPassword() {
        return RandomStringUtils.random(10, true, true); //(số lượng , từ , số)
    }

    // Cập nhật thông tin cá nhân
    public ResponseEntity<?> updateProfile(UpdateProfileDTO updateProfileDTO) {
        try {
            // Tìm user theo id
            User user = userRepository.findById(updateProfileDTO.getIdUser()).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(new Notification("Người dùng không tồn tại!"));
            }

            // Cập nhật thông tin
            if (updateProfileDTO.getFirstName() != null && !updateProfileDTO.getFirstName().trim().isEmpty()) {
                user.setFirstName(updateProfileDTO.getFirstName());
            }

            if (updateProfileDTO.getLastName() != null && !updateProfileDTO.getLastName().trim().isEmpty()) {
                user.setLastName(updateProfileDTO.getLastName());
            }
            
            if (updateProfileDTO.getPhoneNumber() != null && !updateProfileDTO.getPhoneNumber().trim().isEmpty()) {
                user.setPhoneNumber(updateProfileDTO.getPhoneNumber());
            }
            
            if (updateProfileDTO.getDeliveryAddress() != null) {
                user.setDeliveryAddress(updateProfileDTO.getDeliveryAddress());
            }
            if (updateProfileDTO.getDateOfBirth() != null) {
                user.setDateOfBirth(new java.sql.Date(updateProfileDTO.getDateOfBirth().getTime()));
            }
            if (updateProfileDTO.getGender() != null && !updateProfileDTO.getGender().trim().isEmpty()) {
                user.setGender(updateProfileDTO.getGender().charAt(0)); // Lấy ký tự đầu tiên của gender
            }

            // Lưu thay đổi vào database
            userRepository.save(user);

            return ResponseEntity.ok(new Notification("Cập nhật thông tin thành công"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new Notification("Cập nhật thông tin thất bại"));
        }
    }

    // Đổi mật khẩu
    public ResponseEntity<?> changePassword(ChangePasswordDTO changePasswordDTO) {
        try {
            // Tìm user theo id
            User user = userRepository.findById(changePasswordDTO.getIdUser()).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(new Notification("Người dùng không tồn tại!"));
            }

            // Kiểm tra mật khẩu hiện tại
            if (!passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(new Notification("Mật khẩu hiện tại không đúng!"));
            }

            // Kiểm tra mật khẩu mới và xác nhận mật khẩu
            if (!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getConfirmPassword())) {
                return ResponseEntity.badRequest().body(new Notification("Mật khẩu mới và xác nhận mật khẩu không khớp!"));
            }

            // Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
            if (passwordEncoder.matches(changePasswordDTO.getNewPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body(new Notification("Mật khẩu mới phải khác mật khẩu hiện tại!"));
            }

            // Mã hóa mật khẩu mới
            String encodedNewPassword = passwordEncoder.encode(changePasswordDTO.getNewPassword());
            user.setPassword(encodedNewPassword);
            
            // Lưu thay đổi vào database
            userRepository.save(user);

            return ResponseEntity.ok(new Notification("Đổi mật khẩu thành công!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new Notification("Đổi mật khẩu thất bại"));
        }
    }

    // Đổi avatar
    @Override
    @Transactional
    public ResponseEntity<?> changeAvatar(ChangeAvatarDTO changeAvatarDTO) {
        try {
            // Tìm user theo id
            User user = userRepository.findById(changeAvatarDTO.getIdUser()).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(new Notification("Người dùng không tồn tại!"));
            }

            String dataAvatar = changeAvatarDTO.getAvatar();

            // Xóa ảnh cũ trong Cloudinary nếu có
            if (user.getAvatar() != null && !user.getAvatar().isEmpty() && user.getAvatar().length() > 0) {
                try {
                    uploadImageService.deleteImage(user.getAvatar());
                } catch (Exception e) {
                    System.out.println("Không thể xóa ảnh cũ: " + e.getMessage());
                    // Tiếp tục upload ảnh mới dù không xóa được ảnh cũ
                }
            }

            // Kiểm tra và upload ảnh mới nếu là Base64
            if (dataAvatar != null && !dataAvatar.isEmpty() && Base64ToMultipartFileConverter.isBase64(dataAvatar)) {
                MultipartFile avatarFile = Base64ToMultipartFileConverter.convert(dataAvatar);
                if (avatarFile != null) {
                    String avatarUrl = uploadImageService.uploadImage(avatarFile, "User_" + changeAvatarDTO.getIdUser());
                    if (avatarUrl != null && !avatarUrl.isEmpty()) {
                        user.setAvatar(avatarUrl);
                        userRepository.save(user);
                        
                        // Tạo token mới và trả về
                        final String jwtToken = jwtService.generateToken(user.getUsername());
                        return ResponseEntity.ok(new JwtResponse(jwtToken));
                    } else {
                        return ResponseEntity.badRequest().body(new Notification("Upload ảnh thất bại!"));
                    }
                } else {
                    return ResponseEntity.badRequest().body(new Notification("Không thể convert ảnh!"));
                }
            } else {
                return ResponseEntity.badRequest().body(new Notification("Dữ liệu ảnh không hợp lệ!"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new Notification("Đổi avatar thất bại: " + e.getMessage()));
        }
    }
}
