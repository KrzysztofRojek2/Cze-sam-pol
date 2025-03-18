package com.example.store.controllers;

import com.example.store.dto.PartDto;
import com.example.store.dto.TransactionDto;
import com.example.store.models.Status;
import com.example.store.models.Transaction;
import com.example.store.repository.TransactionRepository;
import com.example.store.service.PartService;
import com.example.store.service.TransactionService;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://192.168.100.19:8081" , "http://localhost:8081"})
public class TransactionController {
    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;
    private final PartService partService;

    public TransactionController(TransactionService transactionService, TransactionRepository transactionRepository, PartService partService) {
        this.transactionService = transactionService;
        this.transactionRepository = transactionRepository;
        this.partService = partService;
    }

    @PostMapping("/transaction/create/{userId}")
    public ResponseEntity<TransactionDto> createTransaction(@PathVariable Long userId) {
        return new ResponseEntity<>(transactionService.createTransaction(userId), HttpStatus.CREATED);
    }

//    @GetMapping("/transaction/{transactionId}/parts")
//    public ResponseEntity<Set<PartDto>> getTransactionParts(@PathVariable Long transactionId) {
//        Transaction transaction = transactionRepository.findById(transactionId)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
//
//        Set<PartDto> parts = transaction.getParts().stream()
//                .map(partService::mapPartToDto)
//                .collect(Collectors.toSet());
//
//        return new ResponseEntity<>(parts, HttpStatus.OK);
//    }

    @GetMapping("/transaction/ongoing")
    public ResponseEntity<List<TransactionDto>> getAllAwaitingTransactions() {
        return new ResponseEntity<>(transactionService.getAllAwaitingTransactions(), HttpStatus.OK);
    }

    @GetMapping("/transaction/returned")
    public ResponseEntity<List<TransactionDto>> getAllAwaitingReturnedTransactions() {
        return new ResponseEntity<>(transactionService.getAllReturnedTransactions(), HttpStatus.OK);
    }

    @GetMapping("/transaction/awaiting_return")
    public ResponseEntity<List<TransactionDto>> getAllAwaitingReturnTransactions() {
        return new ResponseEntity<>(transactionService.getAllAwaitingReturnTransactions(), HttpStatus.OK);
    }

    @GetMapping("/transaction/passed")
    public ResponseEntity<List<TransactionDto>> getAllPassedTransaction() {
        return new ResponseEntity<>(transactionService.getAllApprovedTransactions(), HttpStatus.OK);
    }

    @GetMapping("/transaction/{id}")
    public ResponseEntity<TransactionDto> getTransaction(@PathVariable Long id) {
        return new ResponseEntity<>(transactionService.getTransaction(id), HttpStatus.OK);
    }

    @GetMapping("/transaction/ongoing/{userId}")
    public ResponseEntity<TransactionDto> getOngoingTransaction(@PathVariable Long userId) {
        return new ResponseEntity<>(transactionService.getOngoingTransaction(userId), HttpStatus.OK);
    }

    @GetMapping("/transaction/passed/{userId}")
    public ResponseEntity<List<TransactionDto>> getPassedTransaction(@PathVariable Long userId) {
        return new ResponseEntity<>(transactionService.getPassedTransactions(userId), HttpStatus.OK);
    }

    @PutMapping("/transaction/{transactionId}/parts/{partId}")
    public ResponseEntity<Void> putPartInTransaction(@PathVariable Long transactionId, @PathVariable Long partId) {
        transactionService.putPartInTransaction(partId, transactionId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/transaction/{transactionId}/parts/{partId}/increase")
    public ResponseEntity<TransactionDto> increaseQuantity(@PathVariable Long transactionId, @PathVariable Long partId) {
        TransactionDto updatedTransaction = transactionService.increaseQuantity(transactionId, partId);
        return new ResponseEntity<>(updatedTransaction, HttpStatus.OK);
    }

    @PutMapping("/transaction/{transactionId}/parts/{partId}/decrease")
    public ResponseEntity<TransactionDto> decreaseQuantity(@PathVariable Long transactionId, @PathVariable Long partId) {
        TransactionDto updatedTransaction = transactionService.decreaseQuantity(transactionId, partId);
        return new ResponseEntity<>(updatedTransaction, HttpStatus.OK);
    }

    @PutMapping("/transaction/{transactionId}/shipping/{shippingId}")
    public ResponseEntity<TransactionDto> setShipping(@PathVariable Long transactionId, @PathVariable int shippingId) {
        TransactionDto updatedTransaction = transactionService.setShipping(transactionId, shippingId);
        return new ResponseEntity<>(updatedTransaction, HttpStatus.OK);
    }


    //TODO: zamiast setStatus zmienić na finalizeTransaction
    @PutMapping("/transaction/{transactionId}/status/{status}")
    public ResponseEntity<TransactionDto> finalizeTransaction(@PathVariable Long transactionId, @PathVariable Status status) {
        TransactionDto updatedTransaction = transactionService.changeTransactionStatus(transactionId, status);
        transactionService.putDate(transactionId);
        return new ResponseEntity<>(updatedTransaction, HttpStatus.OK);
    }

    @PutMapping("/transactionAccept/{transactionId}/status/{status}")
    public ResponseEntity<TransactionDto> acceptTransaction(@PathVariable Long transactionId, @PathVariable Status status) {
        TransactionDto updatedTransaction = transactionService.changeTransactionStatus2(transactionId, status);
        return new ResponseEntity<>(updatedTransaction, HttpStatus.OK);
    }

    @GetMapping("/transaction/status-changed/{userId}")
    public ResponseEntity<List<Transaction>> hasTransactionStatusChangedToday(@PathVariable Long userId) {
        List<Transaction> transactionList = transactionService.hasStatusChangedToday(userId);
        return new ResponseEntity<>(transactionList, HttpStatus.OK);
    }

//    @GetMapping("/transaction/{id}")
//    public ResponseEntity<Transaction> getTransaction(@PathVariable Long id) {
//        return new ResponseEntity<>(transactionService.getTransaction(id), HttpStatus.OK);
//    }
}
