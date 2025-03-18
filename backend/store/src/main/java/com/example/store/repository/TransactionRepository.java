package com.example.store.repository;

import com.example.store.models.Status;
import com.example.store.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByUserIdAndStatus(Long userId, Status status);
    List<Transaction> findByUserIdAndStatusNot(Long userId, Status status);
    List<Transaction> findByStatusNot(Status status);
    List<Transaction> findByStatus(Status status);
    List<Transaction> findByUserIdAndStatusChangeDateBetween(Long userId, LocalDateTime start, LocalDateTime end);

}
