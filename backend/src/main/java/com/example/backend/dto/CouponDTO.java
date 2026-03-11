package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CouponDTO {
    private int discountPercent;
    private Date expiryDate;
    @JsonProperty("isActive")
    @JsonSetter("isActive")
    private boolean isActive;
    @JsonProperty("isUsed")
    @JsonSetter("isUsed")
    private boolean isUsed;
}