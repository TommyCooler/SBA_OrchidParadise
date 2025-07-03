package com.sba.repository;

import com.sba.pojo.Account;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface IAccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountName(String accountName);
    
    Optional<Account> findByEmail(String email);
    
    boolean existsByAccountName(String accountName);
    
    boolean existsByEmail(String email);

    Account findByAccountId(Long accountId);
}
