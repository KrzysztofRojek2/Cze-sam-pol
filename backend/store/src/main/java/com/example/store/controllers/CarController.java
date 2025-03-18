package com.example.store.controllers;

import com.example.store.dto.BrandDto;
import com.example.store.dto.CarDto;
import com.example.store.dto.responses.CarResponse;
import com.example.store.models.Car;
import com.example.store.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/")
@CrossOrigin(origins = "http://localhost:5173")
public class CarController {
    private CarService carService;

    @Autowired
    public CarController(CarService carService) {
        this.carService = carService;
    }

    @PostMapping("car/create")
    public ResponseEntity<CarDto> createCar(@RequestBody CarDto carDto) {
        return new ResponseEntity<>(carService.createCar(carDto), HttpStatus.CREATED);
    }

//    @GetMapping("car")
//    public ResponseEntity<CarResponse> getAll(
//            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
//            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
//    ) {
//        return new ResponseEntity<>(carService.getAllCars(pageNo, pageSize), HttpStatus.CREATED);
//    }

    @GetMapping("car")
    public ResponseEntity<List<CarDto>> getAll() {
        return new ResponseEntity<>(carService.getAllCars(), HttpStatus.CREATED);
    }

    @GetMapping("car/{id}")
    public ResponseEntity<CarDto> getById(@PathVariable Long id) {
        return new ResponseEntity<>(carService.getCarById(id), HttpStatus.CREATED);
    }

    @PutMapping("car/{id}/update")
    public ResponseEntity<CarDto> update(@PathVariable Long id, @RequestBody CarDto carDto) {
        CarDto response = carService.updateCar(carDto, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("car/{id}/delete")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        carService.deleteCar(id);
        return new ResponseEntity<>("Car deleted", HttpStatus.OK);
    }

    @GetMapping("carsCount")
    public ResponseEntity<Integer> getCarsCount() {
        int carsCount = carService.getCarsCount();
        return ResponseEntity.ok(carsCount);
    }
}
