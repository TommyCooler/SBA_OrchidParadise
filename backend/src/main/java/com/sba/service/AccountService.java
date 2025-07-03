package com.sba.service;

import com.sba.pojo.Account;
import com.sba.repository.IAccountRepository;

import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountService implements IAccountService {

    @Autowired
    public IAccountRepository iAccountRepository;

    @Override
    public Account register(Account account) throws Exception {
        try {
            return iAccountRepository.save(account);
        } catch (Exception e) {
            throw new Exception("Failed to register account: " + e.getMessage());
        } finally {
            Logger.getLogger("Account registration completed.");
        }
    }

    @Override
    public Account login(Account account) {
        return null;
    }

    @Override
    public Account getAccountById(Long accountId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAccountById'");
    }
}
