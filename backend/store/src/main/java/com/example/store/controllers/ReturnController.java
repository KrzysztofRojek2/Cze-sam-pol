package com.example.store.controllers;

import com.example.store.dto.ApiResponse;
import com.example.store.dto.TransactionDto;
import com.example.store.dto.UserDto;
import com.example.store.models.*;
import com.example.store.service.ReturnService;
import com.example.store.service.TransactionService;
import com.example.store.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/returns")
@CrossOrigin(origins = {"http://localhost:5173", "http://10.5.29.21:8081","http://192.168.88.1:8081" , "http://localhost:8081"})
public class ReturnController {
    private final ReturnService returnService;
    private final UserService userService;
    private final TransactionService transactionService;

    public ReturnController(ReturnService returnService, UserService userService, TransactionService transactionService) {
        this.returnService = returnService;
        this.userService = userService;
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<?> createReturn(
            @RequestParam Long userId,
            @RequestParam Long transactionId,
            @RequestParam String reason,
            @RequestParam(required = false) MultipartFile image
    ) {
        try {
            UserDto userDto = userService.getUserById(userId);
            TransactionDto transactionDto = transactionService.getTransaction(transactionId);

            byte[] imageBytes = null;
            if (image != null) {
                imageBytes = image.getBytes();
            }

            returnService.createReturn(userDto, transactionDto, reason, imageBytes);

            return ResponseEntity.ok().body(new ApiResponse(true, "Return request created successfully"));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Error processing image"));
        }
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Return>> getUserReturns(@PathVariable Long userId) {
        List<Return> returns = returnService.getReturnsByUser(userId);
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/returns")
    public ResponseEntity<List<Return>> getAllReturns() {
        List<Return> returns = returnService.getAllReturns();
        return ResponseEntity.ok(returns);
    }

    @PutMapping("/{returnId}")
    public ResponseEntity<String> updateReturnStatus(
            @PathVariable Long returnId,
            @RequestParam ReturnStatus status
    ) {
        returnService.updateReturnStatus(returnId, status);
        return ResponseEntity.ok("Return status updated.");
    }
}
