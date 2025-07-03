package com.sba.service;

import com.sba.pojo.Account;

public interface IAccountService {
    public Account register(Account acount) throws Exception;
    public Account login(Account acount);
    public Account getAccountById(Long accountId);
}
