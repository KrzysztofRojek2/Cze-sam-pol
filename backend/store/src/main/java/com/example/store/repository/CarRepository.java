package com.example.store.repository;

import com.example.store.models.Brand;
import com.example.store.models.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findAllByBrand(Brand brand);
}
