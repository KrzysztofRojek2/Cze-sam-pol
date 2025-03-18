package com.example.store.service.implementation;

import com.example.store.dto.PartDto;
import com.example.store.dto.responses.PartResponse;
import com.example.store.exceptions.CarNotFoundException;
import com.example.store.exceptions.CategoryNotFoundException;
import com.example.store.exceptions.PartNotFoundException;
import com.example.store.models.Brand;
import com.example.store.models.Car;
import com.example.store.models.Category;
import com.example.store.models.Part;
import com.example.store.repository.*;
import com.example.store.service.PartService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PartServiceImplementation implements PartService {


    private PartRepository partRepository;
    private CarRepository carRepository;
    private CategoryRepository categoryRepository;
    private TransactionRepository transactionRepository;

    public PartServiceImplementation(PartRepository partRepository, CarRepository carRepository, CategoryRepository categoryRepository, TransactionRepository transactionRepository) {
        this.partRepository = partRepository;
        this.carRepository = carRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public PartDto createPart(PartDto partDto) {
        Part part = new Part();
        part.setName(partDto.getName());
        part.setDescription(partDto.getDescription());
        part.setPrice(partDto.getPrice());
        part.setDiscount(partDto.getDiscount());
        part.setImage(null);
        part.setQuantity(partDto.getQuantity());
        Category category = categoryRepository.findById(partDto.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        Car car = carRepository.findById(partDto.getCarId())
                .orElseThrow(() -> new CarNotFoundException("Car not found"));
        part.setCategory(category); // Set the category
        part.setCar(car); // Set the car
        partRepository.save(part);


        return mapPartToDto(part);
    }

    @Override
    public Integer getPartsCount() {
        List<Car> car = carRepository.findAll();
        return car.size();
    }


    @Override
    public PartResponse getAllPartsPageable(int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Part> parts = partRepository.findAll(pageable);
        List<Part> listOfParts = parts.getContent();
        List<PartDto> content = listOfParts.stream().map(p -> mapPartToDto(p)).collect(Collectors.toUnmodifiableList());

        PartResponse partResponse = new PartResponse();
        partResponse.setParts(content);
        partResponse.setPageNo(parts.getNumber());
        partResponse.setPageSize(parts.getSize());
        partResponse.setTotalElements(parts.getTotalElements());
        partResponse.setTotalPages(parts.getTotalPages());
        partResponse.setLast(parts.isLast());

        return partResponse;
    }

    @Override
    public List<PartDto> getAllParts() {
        List<Part> parts = partRepository.findAll();
        List<PartDto> partDtos = parts.stream()
                .map(this::mapPartToDto)
                .collect(Collectors.toUnmodifiableList());
        return partDtos;
    }

    @Override
    public PartDto getPartById(Long id) {
        Part part = partRepository.findById(id).orElseThrow(() -> new PartNotFoundException("Part could not be found"));
        return mapPartToDto(part);
    }

    @Override
    public List<PartDto> searchPartsByName(String search, int pageNo, int pageSize) {
        return partRepository.findByNameContainingIgnoreCase(search, PageRequest.of(pageNo, pageSize));
    }

    public PartResponse getPartsByCategory(Integer categoryId, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<Part> partsPage = partRepository.findByCategory_Id(categoryId, pageable);

        List<PartDto> partDtos = partsPage.getContent().stream()
                .map(this::mapPartToDto)
                .collect(Collectors.toList());

        PartResponse partResponse = new PartResponse();
        partResponse.setParts(partDtos);
        partResponse.setPageNo(partsPage.getNumber());
        partResponse.setPageSize(partsPage.getSize());
        partResponse.setTotalElements(partsPage.getTotalElements());
        partResponse.setTotalPages(partsPage.getTotalPages());
        partResponse.setLast(partsPage.isLast());

        return partResponse;
    }

    @Override
    public PartDto updatePart(Long id, PartDto partDto) {
        Part part = partRepository.findById(id)
                .orElseThrow(() -> new PartNotFoundException("Part not found"));

        part.setName(partDto.getName());
        part.setDescription(partDto.getDescription());
        part.setPrice(partDto.getPrice());
        part.setDiscount(partDto.getDiscount());
        part.setQuantity(partDto.getQuantity());

        Category category = categoryRepository.findById(partDto.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        Car car = carRepository.findById(partDto.getCarId())
                .orElseThrow(() -> new CarNotFoundException("Car not found"));

        part.setCategory(category); // Set the category
        part.setCar(car); // Set the car

        partRepository.save(part);

        return mapPartToDto(part);
    }

    @Override
    public void deletePart(Long id) {
        Part part = partRepository.findById(id).orElseThrow(() -> new PartNotFoundException("Part could not be found"));
        partRepository.delete(part);
    }


    public PartDto mapPartToDto(Part part) {
        PartDto partDto = new PartDto();
        partDto.setId(part.getId());
        partDto.setName(part.getName());
        partDto.setDescription(part.getDescription());
        partDto.setPrice(part.getPrice());
        partDto.setDiscount(part.getDiscount());
        partDto.setQuantity(part.getQuantity());
        partDto.setCarId(part.getCar().getId());
        String base64Icon = part.getImage() != null ? "data:image/png;base64," + Base64.getEncoder().encodeToString(part.getImage()) : null;
        partDto.setImage(base64Icon);
        System.out.println("Image for Part ID " + part.getId() + ": " + part.getImage());
        partDto.setCategoryId(part.getCategory().getId());
        return partDto;
    }

    @Override
    public PartDto updatePartImg(Long id, MultipartFile img) throws IOException {
        Part part = partRepository.findById(id).orElseThrow(() -> new PartNotFoundException("Part could not be found"));
        part.setImage(img.getBytes());
        partRepository.save(part);
        return mapPartToDto(part);
    }
}
