package com.example.store.service;

import com.example.store.dto.TransactionDto;
import com.example.store.dto.UserDto;
import com.example.store.models.Return;
import com.example.store.models.ReturnStatus;
import com.example.store.models.Transaction;
import com.example.store.models.UserEntity;
import org.springframework.stereotype.Service;

import java.util.List;

public interface ReturnService {


     List<Return> getReturnsByUser(Long userId);
     List<Return> getAllReturns();

     Return createReturn(UserDto userDto, TransactionDto transactionDto, String reason, byte[] image);

     void updateReturnStatus(Long returnId, ReturnStatus status);
}
