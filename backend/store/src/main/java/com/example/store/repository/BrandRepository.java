package com.example.store.repository;

import com.example.store.models.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Integer> {
    String getBrandNameById(int id);

}
