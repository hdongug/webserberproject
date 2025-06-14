package com.gamemarket.repository;

import com.gamemarket.entity.Item;
import com.gamemarket.entity.Category;
import com.gamemarket.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
    Page<Item> findByStatus(Item.ItemStatus status, Pageable pageable);
    
    Page<Item> findByCategory(Category category, Pageable pageable);
    
    Page<Item> findBySeller(User seller, Pageable pageable);
    
    Page<Item> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE i.status = :status AND i.category = :category")
    Page<Item> findByStatusAndCategory(@Param("status") Item.ItemStatus status, 
                                      @Param("category") Category category, 
                                      Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE i.name LIKE %:keyword% OR i.description LIKE %:keyword%")
    Page<Item> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE i.gameName = :gameName")
    Page<Item> findByGameName(@Param("gameName") String gameName, Pageable pageable);
    
    @Query("SELECT i FROM Item i ORDER BY i.viewCount DESC")
    List<Item> findTopViewedItems(Pageable pageable);
    
    @Query("SELECT i FROM Item i ORDER BY i.createdAt DESC")
    List<Item> findRecentItems(Pageable pageable);
}

