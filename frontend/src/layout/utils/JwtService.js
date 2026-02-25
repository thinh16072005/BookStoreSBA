//Sử dụng thư viện jwt-decode để giúp decode token
import { jwtDecode } from "jwt-decode";

//Kiểm tra token có tồn tại không
export function isToken() {
   const token = localStorage.getItem('token');
   if (token) {
      return true;
   }
   return false;
}

// Kiểm tra token có hết hạn không
export function isTokenExpired(token) {
   const decodedToken = jwtDecode(token);
   if (!decodedToken.exp) {
      return false;
   }
   const currentTime = Date.now() / 1000;
   return currentTime < decodedToken.exp;
}

// Lấy avatar từ token
export function getAvatarByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.avatar;
   }
}

// Lấy lastName từ token
export function getLastNameByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.lastName;
   }
}

// Lấy username từ token
export function getUsernameByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      return jwtDecode(token).sub;
   }
}

// Lấy idUser từ token
export function getIdUserByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.id;
   }
}

// Lấy role từ token
export function getRoleByToken() {
   const token = localStorage.getItem('token');
   if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.role;
   }
}

//Đăng xuất cho user
export function logout(navigate) {
   navigate("/login");
   localStorage.removeItem('token');
}
