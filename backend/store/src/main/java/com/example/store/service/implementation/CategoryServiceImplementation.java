package com.example.store.service.implementation;

import com.example.store.dto.CategoryDto;
import com.example.store.dto.SubcategoryDto;
import com.example.store.models.Category;
import com.example.store.repository.CategoryRepository;
import com.example.store.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Base64;


@Service
public class CategoryServiceImplementation implements CategoryService {
    private CategoryRepository categoryRepository;

    @Autowired
    public CategoryServiceImplementation(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    @Override
    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream().sorted(Comparator.comparing(Category::getId)).map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public Integer getCategoriesCount() {
        List<Category> categories = categoryRepository.findAll();
        return categories.size();
    }

    private CategoryDto mapToDto(Category category) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        String base64Icon = category.getIcon() != null ? "data:image/png;base64," + Base64.getEncoder().encodeToString(category.getIcon()) : null;
        categoryDto.setIcon(base64Icon);

        List<SubcategoryDto> subcategoryDtos = category.getSubcategories().stream()
                .map(subcategory -> {
                    SubcategoryDto subcategoryDto = new SubcategoryDto();
                    subcategoryDto.setId(subcategory.getId());
                    subcategoryDto.setName(subcategory.getName());
                    return subcategoryDto;
                })
                .collect(Collectors.toList());

        categoryDto.setSubcategories(subcategoryDtos);
        return categoryDto;
    }
}
