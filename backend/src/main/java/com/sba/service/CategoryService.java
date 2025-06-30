package com.sba.service;

import com.sba.pojo.Category;
import com.sba.repository.ICategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService implements ICategoryService {
    
    @Autowired
    private ICategoryRepository categoryRepository;
    
    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }
    
    @Override
    public Category getCategoryByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName)
                .orElseThrow(() -> new RuntimeException("Category not found with name: " + categoryName));
    }
    
    @Override
    public Category createCategory(String categoryName) {
        if (categoryRepository.existsByCategoryName(categoryName)) {
            throw new RuntimeException("Category already exists with name: " + categoryName);
        }
        return categoryRepository.save(new Category(categoryName));
    }
    
    @Override
    public Category updateCategory(Long id, Category category) {
        Category existingCategory = getCategoryById(id);
        
        if (!existingCategory.getCategoryName().equals(category.getCategoryName()) 
            && categoryRepository.existsByCategoryName(category.getCategoryName())) {
            throw new RuntimeException("Category already exists with name: " + category.getCategoryName());
        }
        
        existingCategory.setCategoryName(category.getCategoryName());
        return categoryRepository.save(existingCategory);
    }
    
    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }
    
    @Override
    public List<Category> searchCategoriesByName(String name) {
        return categoryRepository.findByCategoryNameContaining(name);
    }
    
    @Override
    public boolean existsByName(String categoryName) {
        return categoryRepository.existsByCategoryName(categoryName);
    }
}
