package com.example.store.service;

import com.example.store.dto.CategoryDto;

import java.util.List;

public interface CategoryService {
    public List<CategoryDto> getAllCategories();
    Integer getCategoriesCount();
}
