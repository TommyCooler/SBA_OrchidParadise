package com.sba.service;

import com.sba.pojo.Role;
import com.sba.repository.IRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService implements IRoleService {
    
    @Autowired
    private IRoleRepository roleRepository;
    
    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
    
    @Override
    public Role getRoleById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
    }
    
    @Override
    public Role getRoleByName(String roleName) {
        return roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found with name: " + roleName));
    }
    
    @Override
    public Role createRole(Role role) {
        if (roleRepository.existsByRoleName(role.getRoleName())) {
            throw new RuntimeException("Role already exists with name: " + role.getRoleName());
        }
        return roleRepository.save(role);
    }
    
    @Override
    public Role updateRole(Integer id, Role role) {
        Role existingRole = getRoleById(id);
        
        if (!existingRole.getRoleName().equals(role.getRoleName()) 
            && roleRepository.existsByRoleName(role.getRoleName())) {
            throw new RuntimeException("Role already exists with name: " + role.getRoleName());
        }
        
        existingRole.setRoleName(role.getRoleName());
        return roleRepository.save(existingRole);
    }
    
    @Override
    public void deleteRole(Integer id) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("Role not found with id: " + id);
        }
        roleRepository.deleteById(id);
    }
    
    @Override
    public List<Role> searchRolesByName(String name) {
        return roleRepository.findByRoleNameContaining(name);
    }
    
    @Override
    public boolean existsByName(String roleName) {
        return roleRepository.existsByRoleName(roleName);
    }
}
