package com.example.store.service;

import com.example.store.dto.TransactionDto;
import com.example.store.models.Status;
import com.example.store.models.Transaction;

import java.util.Date;
import java.util.List;

public interface TransactionService {
    TransactionDto createTransaction(Long userId);

    TransactionDto getTransaction(Long transactionId);

    TransactionDto getOngoingTransaction(Long userId);

    List<TransactionDto> getPassedTransactions(Long userId);

    List<TransactionDto> getAllAwaitingTransactions();

    List<TransactionDto> getAllReturnedTransactions();//nowe

    List<TransactionDto> getAllAwaitingReturnTransactions();//nowe

    List<TransactionDto> getAllApprovedTransactions();


    void putPartInTransaction(Long partId, Long transactionId);

    List<TransactionDto> getAwaitingTransactions(Long userId);

    TransactionDto increaseQuantity(Long transactionId, Long partId);

    TransactionDto decreaseQuantity(Long transactionId, Long partId);

    TransactionDto setShipping(Long transactionId, int shippingId);

    TransactionDto changeTransactionStatus(Long transactionId, Status status);

    TransactionDto changeTransactionStatus2(Long transactionId, Status status);


    TransactionDto putDate(long transactionId);
    List<Transaction> hasStatusChangedToday(Long userId);


}
