package com.example.store.dto;

import lombok.Data;

@Data
public class LoginDto {
    private Long userId;
    private String username;
    private String password;
}
