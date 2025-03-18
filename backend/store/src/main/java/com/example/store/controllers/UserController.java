package com.example.store.controllers;

import com.example.store.dto.AddressDto;
import com.example.store.dto.UserDto;
import com.example.store.security.JWTGenerator;
import com.example.store.service.AddressService;
import com.example.store.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final AddressService addressService;
//    private final JWTGenerator jwtGenerator;

    public UserController(UserService userService, AddressService addressService) {
        this.userService = userService;
        this.addressService = addressService;
    }

    @GetMapping("user/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
        UserDto userDto = userService.getUserById(userId);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("user/{userId}/address")
    public ResponseEntity<AddressDto> getUserAddressById(@PathVariable Long userId) {
        AddressDto addressDto = addressService.getAddressByUserId(userId);
        return ResponseEntity.ok(addressDto);
    }

    @GetMapping("users")
    public ResponseEntity<List<UserDto>> getUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }
//
//    @GetMapping("/{userId}")
//    public ResponseEntity<UserDto> getUserByUserId(@PathVariable Long userId) {
//        UserDto userDto = userService.getUserById(userId);
//        return ResponseEntity.ok(userDto);
//    }

    @PutMapping("user/update/{userId}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long userId, @RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateUser(userDto, userId);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("user/ban/{userId}")
    public ResponseEntity<UserDto> banUser(@PathVariable Long userId) {
        UserDto bannedUser = userService.banUser(userId);
        return ResponseEntity.ok(bannedUser);
    }

    @PutMapping("user/unban/{userId}")
    public ResponseEntity<UserDto> unbanUser(@PathVariable Long userId) {
        UserDto unbannedUser = userService.unbanUser(userId);
        return ResponseEntity.ok(unbannedUser);
    }
//
//    @GetMapping("address/{userId}")
//    public ResponseEntity<AddressDto> getUserAddress(@PathVariable Long userId) {
//        AddressDto addressDto = addressService.getAddressByUserId(userId);
//        return ResponseEntity.ok(addressDto);
//    }

    @PutMapping("address/update/{userId}")
    public ResponseEntity<AddressDto> updateUserAddress(@PathVariable Long userId, @RequestBody AddressDto addressDto) {
        AddressDto updatedAddress = addressService.updateAddress(addressDto, userId);
        return ResponseEntity.ok(updatedAddress);
    }
//
//    private Long getCurrentUserId() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && authentication.isAuthenticated()) {
//            String token = (String) authentication.getCredentials();
//            return jwtGenerator.getUserIdFromJWT(token);
//        }
//        throw new RuntimeException("Current user ID not found");
//    }
    @GetMapping("usersCount")
    public ResponseEntity<Integer> getUserCount() {
        int usersCount = userService.getUsersCount();
        return ResponseEntity.ok(usersCount);
    }
}