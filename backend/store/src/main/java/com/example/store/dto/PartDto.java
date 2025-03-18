package com.example.store.dto;

import com.example.store.models.Part;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartDto {
    private Long id;
    private String name;
    private String description;
    private String image;
    private Double price;
    private Integer discount;
    private Integer quantity;

    private Integer categoryId;
    private Long carId;
}
