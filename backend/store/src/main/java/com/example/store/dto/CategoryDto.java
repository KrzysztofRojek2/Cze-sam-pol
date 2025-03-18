package com.example.store.dto;

import com.example.store.models.Part;
import com.example.store.models.Subcategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
    private Integer id;
    private String name;
    private String icon;
    private List<SubcategoryDto> subcategories = new ArrayList<>();
}