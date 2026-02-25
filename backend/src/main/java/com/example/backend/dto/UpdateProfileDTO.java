package com.example.backend.dto;

import java.util.Date;
import lombok.Data;

@Data
public class UpdateProfileDTO {
    private int idUser;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String deliveryAddress;
    private String gender;
    private Date dateOfBirth;

   
    public UpdateProfileDTO() {}

   
    public UpdateProfileDTO(int idUser, String firstName, String lastName, String phoneNumber, String deliveryAddress,
                            String gender, Date dateOfBirth) {
        this.idUser = idUser;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.deliveryAddress = deliveryAddress;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
    }
}

