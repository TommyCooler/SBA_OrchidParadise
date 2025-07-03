package com.sba.service;

import com.sba.pojo.Account;
import com.sba.pojo.Role;
import com.sba.repository.IAccountRepository;
import com.sba.repository.IRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private IAccountRepository iAccountRepository;

    @Autowired
    private IRoleRepository iRoleRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String login(String accountName, String password) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(accountName, password));

            Account account = iAccountRepository.findByAccountName(accountName)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            return jwtService.generateToken(account.getAccountName(), account.getRole().getRoleName(), account.getAccountId());
            
        } catch (Exception e) {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public Account register(String accountName, String email, String password) {
        // Kiểm tra account name đã tồn tại
        if (iAccountRepository.existsByAccountName(accountName)) {
            throw new RuntimeException("Account name already exists");
        }

        // Kiểm tra email đã tồn tại
        if (iAccountRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        // Lấy role mặc định (ví dụ: USER)
        Role defaultRole = iRoleRepository.findByRoleName("USER")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        Account account = new Account();
        account.setAccountName(accountName);
        account.setEmail(email);
        account.setPassword(passwordEncoder.encode(password));
        account.setRole(defaultRole);

        return iAccountRepository.save(account);
    }
}