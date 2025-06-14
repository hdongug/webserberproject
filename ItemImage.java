package com.gamemarket.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "item_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "image_url", nullable = false)
    @NotBlank(message = "이미지 URL은 필수입니다")
    private String imageUrl;
    
    @Column(name = "original_filename")
    private String originalFilename;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "display_order")
    private Integer displayOrder = 0;
    
    @Column(name = "is_primary")
    private Boolean isPrimary = false;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // 아이템
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

