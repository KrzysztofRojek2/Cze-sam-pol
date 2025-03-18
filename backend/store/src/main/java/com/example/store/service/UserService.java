package com.example.store.service;

import com.example.store.dto.UserDto;

import java.util.List;

public interface UserService {
    UserDto getUserById(Long id);
    UserDto updateUser(UserDto userDto, Long id);
    Long getUserIdByUsername(String username);
    UserDto banUser( Long id);
    UserDto unbanUser( Long id);
    Integer getUsersCount();

    Integer getUserRoles(Long userId);
    //List<PartDto> getAllParts();
    List<UserDto> getAllUsers();
}