package com.example.store.service;

import com.example.store.dto.BrandDto;
import com.example.store.dto.responses.BrandResponse;
import com.example.store.models.Brand;

import java.util.List;


public interface BrandService {
    BrandDto createBrand(BrandDto brandDto);

//    BrandResponse getAllBrands(int pageNo, int pageSize);
    List<BrandDto> getAllBrands();

    Integer getBrandsCount();

    BrandDto getBrandById(int id);

    BrandDto updateBrand(BrandDto brandDto, int id);

    void deleteBrand(int id);
}
