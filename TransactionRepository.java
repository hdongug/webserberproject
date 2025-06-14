package com.gamemarket.repository;

import com.gamemarket.entity.Transaction;
import com.gamemarket.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionCode(String transactionCode);
    
    Page<Transaction> findByBuyer(User buyer, Pageable pageable);
    
    Page<Transaction> findBySeller(User seller, Pageable pageable);
    
    Page<Transaction> findByStatus(Transaction.TransactionStatus status, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE t.buyer = :user OR t.seller = :user ORDER BY t.createdAt DESC")
    Page<Transaction> findByUser(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.seller = :seller AND t.status = 'COMPLETED'")
    Long countCompletedTransactionsBySeller(@Param("seller") User seller);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.buyer = :buyer AND t.status = 'COMPLETED'")
    Long countCompletedTransactionsByBuyer(@Param("buyer") User buyer);
}

