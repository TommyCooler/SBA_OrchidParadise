package com.sba.service;

import com.sba.dto.OrchidRequest;
import com.sba.pojo.Orchid;

import java.util.List;

public interface IOrchidService {
    
    List<Orchid> getAllOrchids();
    
    Orchid getOrchidById(Long id);
    
    Orchid getOrchidByName(String orchidName);
    
    Orchid createOrchid(OrchidRequest orchidRequest);
    
    Orchid updateOrchid(Long id, OrchidRequest orchidRequest);
    
    void deleteOrchid(Long id);
    
    List<Orchid> getOrchidsByCategory(Long categoryId);
    
    List<Orchid> getOrchidsByNatureType(Boolean isNatural);
    
    List<Orchid> getOrchidsByPriceRange(Double minPrice, Double maxPrice);
    
    List<Orchid> searchOrchidsByName(String name);
    
    List<Orchid> searchOrchidsByDescription(String description);
    
    List<Orchid> getOrchidsOrderByPriceAsc();
    
    List<Orchid> getOrchidsOrderByPriceDesc();
    
    boolean existsByName(String orchidName);
}
