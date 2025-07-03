package com.sba.controller;

import com.sba.dto.OrchidRequest;
import com.sba.pojo.Orchid;
import com.sba.service.IOrchidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/orchids")
public class OrchidController {

    @Autowired
    private IOrchidService orchidService;

    @GetMapping("/")
    public ResponseEntity<List<Orchid>> getAllOrchids() {
        try {
            List<Orchid> orchids = orchidService.getAllOrchids();
            return ResponseEntity.ok(orchids);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orchid> getOrchidById(@PathVariable Long id) {
        try {
            Orchid orchid = orchidService.getOrchidById(id);
            return ResponseEntity.ok(orchid);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/name/{orchidName}")
    public ResponseEntity<Orchid> getOrchidByName(@PathVariable String orchidName) {
        try {
            Orchid orchid = orchidService.getOrchidByName(orchidName);
            return ResponseEntity.ok(orchid);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrchid(@Valid @RequestBody OrchidRequest orchidRequest) {
        try {
            orchidService.createOrchid(orchidRequest);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Orchid> updateOrchid(@PathVariable Long id, @Valid @RequestBody OrchidRequest orchidRequest) {
        try {
            Orchid updatedOrchid = orchidService.updateOrchid(id, orchidRequest);
            return ResponseEntity.ok(updatedOrchid);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteOrchid(@PathVariable Long id) {
        try {
            orchidService.deleteOrchid(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Orchid>> getOrchidsByCategory(@PathVariable Long categoryId) {
        try {
            List<Orchid> orchids = orchidService.getOrchidsByCategory(categoryId);
            return ResponseEntity.ok(orchids);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/natural/{isNatural}")
    public ResponseEntity<List<Orchid>> getOrchidsByNatureType(@PathVariable Boolean isNatural) {
        try {
            List<Orchid> orchids = orchidService.getOrchidsByNatureType(isNatural);
            return ResponseEntity.ok(orchids);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<Orchid>> getOrchidsByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        try {
            List<Orchid> orchids = orchidService.getOrchidsByPriceRange(minPrice, maxPrice);
            return ResponseEntity.ok(orchids);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search/name")
    public ResponseEntity<List<Orchid>> searchOrchidsByName(@RequestParam String name) {
        try {
            List<Orchid> orchids = orchidService.searchOrchidsByName(name);
            return ResponseEntity.ok(orchids);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search/description")
    public ResponseEntity<List<Orchid>> searchOrchidsByDescription(@RequestParam String description) {
        try {
            List<Orchid> orchids = orchidService.searchOrchidsByDescription(description);
            return ResponseEntity.ok(orchids);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/sorted/price-asc")
    public ResponseEntity<List<Orchid>> getOrchidsOrderByPriceAsc() {
        try {
            List<Orchid> orchids = orchidService.getOrchidsOrderByPriceAsc();
            return ResponseEntity.ok(orchids);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/sorted/price-desc")
    public ResponseEntity<List<Orchid>> getOrchidsOrderByPriceDesc() {
        try {
            List<Orchid> orchids = orchidService.getOrchidsOrderByPriceDesc();
            return ResponseEntity.ok(orchids);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/exists/{orchidName}")
    public ResponseEntity<Boolean> existsByName(@PathVariable String orchidName) {
        try {
            boolean exists = orchidService.existsByName(orchidName);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
