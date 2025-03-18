package com.example.store.service.implementation;

import com.example.store.dto.BrandDto;
import com.example.store.dto.PartDto;
import com.example.store.dto.responses.BrandResponse;
import com.example.store.exceptions.BrandNotFoundException;
import com.example.store.models.Brand;
import com.example.store.models.Part;
import com.example.store.repository.BrandRepository;
import com.example.store.service.BrandService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandServiceImplementation implements BrandService {

    private BrandRepository brandRepository;

    public BrandServiceImplementation(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Override
    public BrandDto createBrand(BrandDto brandDto) {
        Brand brand = new Brand();
        brand.setName(brandDto.getName());

        brandRepository.save(brand);

        BrandDto brandResponse = new BrandDto();
        brandResponse.setId(brand.getId());
        brandResponse.setName(brandDto.getName());
        return brandResponse;
    }


@Override
public List<BrandDto> getAllBrands() {
    List<Brand> brand = brandRepository.findAll();
    List<BrandDto> brandDtos = brand.stream()
            .map(this::mapToDto)
            .collect(Collectors.toUnmodifiableList());
    return brandDtos;
}

    @Override
    public Integer getBrandsCount() {
        List<Brand> brand = brandRepository.findAll();
        return brand.size();
    }

    @Override
    public BrandDto getBrandById(int id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new BrandNotFoundException("Brand could not be found"));
        return mapToDto(brand);
    }

    @Override
    public BrandDto updateBrand(BrandDto brandDto, int id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new BrandNotFoundException("Brand not found"));
        brand.setName(brandDto.getName());
        brandRepository.save(brand);
        return mapToDto(brand);
    }

    @Override
    public void deleteBrand(int id) {
        Brand brand = brandRepository.findById(id).orElseThrow(() -> new BrandNotFoundException("Brand not found"));
        brandRepository.delete(brand);
    }

    private BrandDto mapToDto(Brand brand) {
        BrandDto brandDto = new BrandDto();
        brandDto.setId(brand.getId());
        brandDto.setName(brand.getName());
        return brandDto;
    }
}
