package com.example.store.repository;

import com.example.store.models.Part;
import com.example.store.models.Transaction;
import com.example.store.models.TransactionPart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionPartRepository extends JpaRepository<TransactionPart, Long> {
    Optional<TransactionPart> findByTransactionAndPart(Transaction transaction, Part part);

    List<TransactionPart> findByTransaction(Transaction transaction);
}
