package com.example.store.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String accessToken;
    private String tokenType = "Bearer ";
    private Integer roleId;
    private Long userId;

    public AuthResponseDto(String accessToken, long userId, int roleId) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.roleId = roleId;
    }
}
