package com.sba.service;

import com.sba.pojo.Role;

import java.util.List;

public interface IRoleService {
    
    List<Role> getAllRoles();
    
    Role getRoleById(Integer id);
    
    Role getRoleByName(String roleName);
    
    Role createRole(Role role);
    
    Role updateRole(Integer id, Role role);
    
    void deleteRole(Integer id);
    
    List<Role> searchRolesByName(String name);
    
    boolean existsByName(String roleName);
}
