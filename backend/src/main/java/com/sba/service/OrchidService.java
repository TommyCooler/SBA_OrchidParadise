package com.sba.service;

import com.sba.dto.OrchidRequest;
import com.sba.pojo.Category;
import com.sba.pojo.Orchid;
import com.sba.repository.IOrchidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrchidService implements IOrchidService {
    
    @Autowired
    private IOrchidRepository orchidRepository;
    
    @Autowired
    private CategoryService categoryService;
    
    @Override
    public List<Orchid> getAllOrchids() {
        return orchidRepository.findAll();
    }
    
    @Override
    public Orchid getOrchidById(Long id) {
        return orchidRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orchid not found with id: " + id));
    }
    
    @Override
    public Orchid getOrchidByName(String orchidName) {
        return orchidRepository.findByOrchidName(orchidName)
                .orElseThrow(() -> new RuntimeException("Orchid not found with name: " + orchidName));
    }
    
    @Override
    public Orchid createOrchid(OrchidRequest orchidRequest) {
        // Convert OrchidRequest to Orchid entity
        Orchid orchid = new Orchid();
        orchid.setNatural(orchidRequest.isNatural());
        orchid.setOrchidDescription(orchidRequest.orchidDescription());
        orchid.setOrchidName(orchidRequest.orchidName());
        orchid.setOrchidUrl(orchidRequest.orchidUrl());
        orchid.setPrice(orchidRequest.price());
        
        // Get category by ID
        Category category = categoryService.getCategoryById(orchidRequest.categoryId());
        orchid.setCategory(category);
        
        return orchidRepository.save(orchid);
    }
    
    @Override
    public Orchid updateOrchid(Long id, OrchidRequest orchidRequest) {
        Orchid existingOrchid = getOrchidById(id);
        
        existingOrchid.setNatural(orchidRequest.isNatural());
        existingOrchid.setOrchidDescription(orchidRequest.orchidDescription());
        existingOrchid.setOrchidName(orchidRequest.orchidName());
        existingOrchid.setOrchidUrl(orchidRequest.orchidUrl());
        existingOrchid.setPrice(orchidRequest.price());
        
        // Update category if changed
        Category category = categoryService.getCategoryById(orchidRequest.categoryId());
        existingOrchid.setCategory(category);
        
        return orchidRepository.save(existingOrchid);
    }
    
    @Override
    public void deleteOrchid(Long id) {
        if (!orchidRepository.existsById(id)) {
            throw new RuntimeException("Orchid not found with id: " + id);
        }
        orchidRepository.deleteById(id);
    }
    
    @Override
    public List<Orchid> getOrchidsByCategory(Long categoryId) {
        return orchidRepository.findByCategory_CategoryId(categoryId);
    }
    
    @Override
    public List<Orchid> getOrchidsByNatureType(Boolean isNatural) {
        return orchidRepository.findByIsNatural(isNatural);
    }
    
    @Override
    public List<Orchid> getOrchidsByPriceRange(Double minPrice, Double maxPrice) {
        return orchidRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    @Override
    public List<Orchid> searchOrchidsByName(String name) {
        return orchidRepository.findByOrchidNameContaining(name);
    }
    
    @Override
    public List<Orchid> searchOrchidsByDescription(String description) {
        return orchidRepository.findByOrchidDescriptionContaining(description);
    }
    
    @Override
    public List<Orchid> getOrchidsOrderByPriceAsc() {
        return orchidRepository.findAllOrderByPriceAsc();
    }
    
    @Override
    public List<Orchid> getOrchidsOrderByPriceDesc() {
        return orchidRepository.findAllOrderByPriceDesc();
    }
    
    @Override
    public boolean existsByName(String orchidName) {
        return orchidRepository.existsByOrchidName(orchidName);
    }
}
