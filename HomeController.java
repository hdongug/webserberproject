package com.gamemarket.controller;

import com.gamemarket.entity.Item;
import com.gamemarket.entity.Category;
import com.gamemarket.repository.ItemRepository;
import com.gamemarket.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class HomeController {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping({"/", "/home"})
    public String home(Model model) {
        // 최신 아이템 8개
        Pageable recentPageable = PageRequest.of(0, 8, Sort.by("createdAt").descending());
        List<Item> recentItems = itemRepository.findRecentItems(recentPageable);
        
        // 인기 아이템 8개
        Pageable popularPageable = PageRequest.of(0, 8, Sort.by("viewCount").descending());
        List<Item> popularItems = itemRepository.findTopViewedItems(popularPageable);
        
        // 활성 카테고리 목록
        List<Category> categories = categoryRepository.findActiveCategoriesOrderByDisplayOrder();
        
        model.addAttribute("recentItems", recentItems);
        model.addAttribute("popularItems", popularItems);
        model.addAttribute("categories", categories);
        
        return "index";
    }

    @GetMapping("/items")
    public String items(@RequestParam(defaultValue = "0") int page,
                       @RequestParam(defaultValue = "12") int size,
                       @RequestParam(required = false) Long categoryId,
                       @RequestParam(required = false) String keyword,
                       @RequestParam(defaultValue = "createdAt") String sort,
                       @RequestParam(defaultValue = "desc") String direction,
                       Model model) {
        
        Sort.Direction sortDirection = direction.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<Item> itemPage;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            itemPage = itemRepository.searchByKeyword(keyword, pageable);
            model.addAttribute("keyword", keyword);
        } else if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId).orElse(null);
            if (category != null) {
                itemPage = itemRepository.findByStatusAndCategory(Item.ItemStatus.AVAILABLE, category, pageable);
                model.addAttribute("selectedCategory", category);
            } else {
                itemPage = itemRepository.findByStatus(Item.ItemStatus.AVAILABLE, pageable);
            }
        } else {
            itemPage = itemRepository.findByStatus(Item.ItemStatus.AVAILABLE, pageable);
        }
        
        List<Category> categories = categoryRepository.findActiveCategoriesOrderByDisplayOrder();
        
        model.addAttribute("itemPage", itemPage);
        model.addAttribute("categories", categories);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", itemPage.getTotalPages());
        model.addAttribute("sort", sort);
        model.addAttribute("direction", direction);
        
        return "items/list";
    }

    @GetMapping("/login")
    public String login(@RequestParam(value = "error", required = false) String error,
                       @RequestParam(value = "logout", required = false) String logout,
                       Model model) {
        
        if (error != null) {
            model.addAttribute("error", "아이디 또는 비밀번호가 올바르지 않습니다.");
        }
        
        if (logout != null) {
            model.addAttribute("message", "성공적으로 로그아웃되었습니다.");
        }
        
        return "user/login";
    }

    @GetMapping("/register")
    public String register() {
        return "user/register";
    }
}

