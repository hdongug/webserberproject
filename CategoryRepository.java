package com.gamemarket.repository;

import com.gamemarket.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    List<Category> findByActiveTrue();
    
    @Query("SELECT c FROM Category c WHERE c.active = true ORDER BY c.displayOrder ASC")
    List<Category> findActiveCategoriesOrderByDisplayOrder();
    
    boolean existsByName(String name);
}

