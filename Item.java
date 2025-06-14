package com.gamemarket.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    @NotBlank(message = "아이템 이름은 필수입니다")
    @Size(max = 200, message = "아이템 이름은 200자를 초과할 수 없습니다")
    private String name;
    
    @Column(columnDefinition = "TEXT")
    @Size(max = 2000, message = "설명은 2000자를 초과할 수 없습니다")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    @NotNull(message = "가격은 필수입니다")
    @DecimalMin(value = "0.0", inclusive = false, message = "가격은 0보다 커야 합니다")
    private BigDecimal price;
    
    @Column(nullable = false)
    @NotNull(message = "수량은 필수입니다")
    private Integer quantity = 1;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemStatus status = ItemStatus.AVAILABLE;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemCondition condition = ItemCondition.NEW;
    
    @Column(name = "game_name", length = 100)
    private String gameName;
    
    @Column(name = "server_name", length = 100)
    private String serverName;
    
    @Column(name = "item_level")
    private Integer itemLevel;
    
    @Column(name = "item_grade", length = 50)
    private String itemGrade;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "view_count")
    private Integer viewCount = 0;
    
    // 판매자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
    
    // 카테고리
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    // 거래 내역
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions;
    
    // 아이템 이미지들
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ItemImage> images;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum ItemStatus {
        AVAILABLE,    // 판매중
        RESERVED,     // 예약중
        SOLD,         // 판매완료
        INACTIVE      // 비활성
    }
    
    public enum ItemCondition {
        NEW,          // 새상품
        LIKE_NEW,     // 거의새것
        GOOD,         // 좋음
        FAIR,         // 보통
        POOR          // 나쁨
    }
}

