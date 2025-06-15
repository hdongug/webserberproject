package com.gamemarket.controller;

import com.gamemarket.entity.User;
import com.gamemarket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping("/register")
    public String registerForm() {
        return "register";
    }
    
    @PostMapping("/register")
    public String register(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String confirmPassword,
            @RequestParam String nickname,
            @RequestParam String email,
            @RequestParam(required = false) String agreeTerms,
            @RequestParam(required = false) String agreePrivacy,
            @RequestParam(required = false) String agreeMarketing,
            Model model,
            RedirectAttributes redirectAttributes) {
        
        try {
            // 입력값 검증
            if (username == null || username.trim().isEmpty()) {
                model.addAttribute("error", "아이디를 입력해주세요.");
                return "register";
            }
            
            if (password == null || password.length() < 8) {
                model.addAttribute("error", "비밀번호는 8자 이상이어야 합니다.");
                return "register";
            }
            
            if (!password.equals(confirmPassword)) {
                model.addAttribute("error", "비밀번호가 일치하지 않습니다.");
                return "register";
            }
            
            if (nickname == null || nickname.trim().isEmpty()) {
                model.addAttribute("error", "닉네임을 입력해주세요.");
                return "register";
            }
            
            if (email == null || email.trim().isEmpty()) {
                model.addAttribute("error", "이메일을 입력해주세요.");
                return "register";
            }
            
            // 필수 약관 동의 확인
            if (agreeTerms == null || agreePrivacy == null) {
                model.addAttribute("error", "필수 약관에 동의해주세요.");
                return "register";
            }
            
            // 중복 검사
            if (userRepository.existsByUsername(username.trim())) {
                model.addAttribute("error", "이미 사용 중인 아이디입니다.");
                return "register";
            }
            
            if (userRepository.existsByEmail(email.trim())) {
                model.addAttribute("error", "이미 사용 중인 이메일입니다.");
                return "register";
            }
            
            // 사용자 생성
            User user = new User();
            user.setUsername(username.trim());
            user.setPassword(passwordEncoder.encode(password));
            user.setNickname(nickname.trim());
            user.setEmail(email.trim());
            user.setRole(User.UserRole.USER);
            user.setEnabled(true);
            
            userRepository.save(user);
            
            redirectAttributes.addFlashAttribute("message", "회원가입이 완료되었습니다. 로그인해주세요.");
            return "redirect:/login";
            
        } catch (Exception e) {
            model.addAttribute("error", "회원가입 중 오류가 발생했습니다: " + e.getMessage());
            return "register";
        }
    }
}

