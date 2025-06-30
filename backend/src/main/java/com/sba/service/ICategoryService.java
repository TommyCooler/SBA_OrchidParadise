package com.sba.service;

import com.sba.pojo.Category;

import java.util.List;

public interface ICategoryService {
    
    List<Category> getAllCategories();
    
    Category getCategoryById(Long id);
    
    Category getCategoryByName(String categoryName);
    
    Category createCategory(String categoryName);
    
    Category updateCategory(Long id, Category category);
    
    void deleteCategory(Long id);
    
    List<Category> searchCategoriesByName(String name);
    
    boolean existsByName(String categoryName);
}
