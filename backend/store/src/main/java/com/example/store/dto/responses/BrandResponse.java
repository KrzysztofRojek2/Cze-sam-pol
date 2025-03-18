package com.example.store.dto.responses;

import com.example.store.dto.BrandDto;
import com.example.store.models.Brand;
import lombok.Data;

import java.util.List;

@Data
public class BrandResponse {
    private List<BrandDto> brands;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;
}

