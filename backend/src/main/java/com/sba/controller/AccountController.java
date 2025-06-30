package com.sba.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sba.dto.LoginRequest;
import com.sba.dto.RegisterRequest;
import com.sba.pojo.Account;
import com.sba.service.IAccountService;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private IAccountService iAccountService;

    @PostMapping("/register")
    public ResponseEntity<?> register(RegisterRequest loginRequest) throws Exception {
        iAccountService.register(new Account(loginRequest.email(), loginRequest.password(), loginRequest.fullName()));
        return ResponseEntity.ok("Register successful");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(LoginRequest loginRequest) {
        iAccountService.login(null);
        return ResponseEntity.ok("Login successful");
    }
}
