package com.sba.service;

import com.sba.pojo.Account;
import com.sba.repository.IAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private IAccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String accountName) throws UsernameNotFoundException {
        Account account = accountRepository.findByAccountName(accountName)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + accountName));

        return User.builder()
                .username(account.getAccountName())
                .password(account.getPassword())
                .authorities(Collections.singleton(new SimpleGrantedAuthority("ROLE_" + account.getRole().getRoleName())))
                .build();
    }
}
