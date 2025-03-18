package com.example.store.dto;

import com.example.store.models.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDto {
    private Long id;
    private LocalDateTime date;
    private Status status;
    private double price;

    private Long userId;
    private Integer shippingId;

    private Set<TransactionPartDto> transactionParts;
}
