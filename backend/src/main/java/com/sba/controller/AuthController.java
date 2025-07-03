package com.sba.controller;

import com.sba.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpServletResponse response) {
        try {
            String token = authService.login(
                loginRequest.get("accountName"), 
                loginRequest.get("password")
            );

            Map<String, Object> responseBody = Map.of(
                "token", token,
                "message", "Login successful",
                "expiresIn", 36000 // seconds
            );
            
            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        try {
            authService.register(
                registerRequest.get("accountName"),
                registerRequest.get("email"),
                registerRequest.get("password")
            );
            return ResponseEntity.ok(Map.of("message", "Account created successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        try {
            // Xóa cookie bằng cách set maxAge = 0
            Cookie tokenCookie = new Cookie("authToken", "");
            tokenCookie.setHttpOnly(true);
            tokenCookie.setSecure(false);
            tokenCookie.setPath("/");
            tokenCookie.setMaxAge(0); // Xóa cookie
            response.addCookie(tokenCookie);
            
            return ResponseEntity.ok(Map.of("message", "Logout successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Logout failed"));
        }
    }


}