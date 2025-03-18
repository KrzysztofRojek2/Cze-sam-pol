package com.example.store.service;

import com.example.store.dto.CarDto;
import com.example.store.dto.responses.BrandResponse;
import com.example.store.dto.responses.CarResponse;

import java.util.List;

public interface CarService {
    CarDto createCar(CarDto carDto);

//    CarResponse getAllCars(int pageNo, int pageSize);

    List<CarDto> getAllCars();

    Integer getCarsCount();

    CarDto getCarById(Long id);

    CarDto updateCar(CarDto carDto, Long id);

    void deleteCar(Long id);
}
