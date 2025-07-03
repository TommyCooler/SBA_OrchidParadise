package com.sba.repository;

import com.sba.pojo.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IOrchidRepository extends JpaRepository<Orchid, Long> {
    
    Optional<Orchid> findByOrchidName(String orchidName);
    
    boolean existsByOrchidName(String orchidName);

    Orchid findByOrchidId(Long orchidId);
    
    List<Orchid> findByCategory_CategoryId(Long categoryId);
    
    List<Orchid> findByIsNatural(Boolean isNatural);
    
    @Query("SELECT o FROM Orchid o WHERE o.price BETWEEN :minPrice AND :maxPrice")
    List<Orchid> findByPriceBetween(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    @Query("SELECT o FROM Orchid o WHERE LOWER(o.orchidName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Orchid> findByOrchidNameContaining(@Param("name") String name);
    
    @Query("SELECT o FROM Orchid o WHERE LOWER(o.orchidDescription) LIKE LOWER(CONCAT('%', :description, '%'))")
    List<Orchid> findByOrchidDescriptionContaining(@Param("description") String description);
    
    @Query("SELECT o FROM Orchid o ORDER BY o.price ASC")
    List<Orchid> findAllOrderByPriceAsc();
    
    @Query("SELECT o FROM Orchid o ORDER BY o.price DESC")
    List<Orchid> findAllOrderByPriceDesc();
}
