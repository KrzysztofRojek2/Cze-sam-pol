package com.example.store.service.implementation;

import com.example.store.dto.BrandDto;
import com.example.store.dto.CarDto;
import com.example.store.dto.PartDto;
import com.example.store.dto.responses.CarResponse;
import com.example.store.exceptions.BrandNotFoundException;
import com.example.store.exceptions.CarNotFoundException;
import com.example.store.models.Brand;
import com.example.store.models.Car;
import com.example.store.models.Part;
import com.example.store.repository.BrandRepository;
import com.example.store.repository.CarRepository;
import com.example.store.service.CarService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarServiceImplementation implements CarService {

    private CarRepository carRepository;
    private BrandRepository brandRepository;

    public CarServiceImplementation(CarRepository carRepository, BrandRepository brandRepository) {
        this.carRepository = carRepository;
        this.brandRepository = brandRepository;
    }

    @Override
    public CarDto createCar(CarDto carDto) {
        Car car = new Car();
        car.setName(carDto.getName());
        Brand brand = brandRepository.findById(carDto.getBrand().getId())
                .orElseThrow(() -> new BrandNotFoundException("This brand does not exist"));
        car.setBrand(brand);
        carRepository.save(car);

        return mapToDto(car);
    }


@Override
public List<CarDto> getAllCars() {
    List<Car> cars = carRepository.findAll();
    List<CarDto> carDtos = cars.stream()
            .map(this::mapToDto)
            .collect(Collectors.toUnmodifiableList());
    return carDtos;
}

    @Override
    public Integer getCarsCount() {
        List<Car> cars = carRepository.findAll();
        return cars.size();
    }

    @Override
    public CarDto getCarById(Long id) {
        Car car = carRepository.findById(id).orElseThrow(() -> new CarNotFoundException("Car could not be found"));
        return mapToDto(car);
    }

    @Override
    public CarDto updateCar(CarDto carDto, Long id) {
        Car car = carRepository.findById(id).orElseThrow(() -> new CarNotFoundException("Car could not be found"));
        Brand brand = brandRepository.findById(carDto.getBrand().getId())
                .orElseThrow(() -> new BrandNotFoundException("This brand does not exist"));

        car.setName(carDto.getName());
        car.setBrand(brand);
        carRepository.save(car);

        return mapToDto(car);
    }

    @Override
    public void deleteCar(Long id) {
        Car car = carRepository.findById(id).orElseThrow(() -> new CarNotFoundException("Car could not be found"));
        carRepository.delete(car);
    }

    private CarDto mapToDto(Car car) {
        CarDto carDto = new CarDto();
        carDto.setId(car.getId());
        carDto.setName(car.getName());

        BrandDto brandDto = new BrandDto();
        brandDto.setId(car.getBrand().getId());
        brandDto.setName(car.getBrand().getName());

        carDto.setBrand(brandDto);
        return carDto;
    }

}
