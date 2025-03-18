package com.example.store.dto.responses;

import com.example.store.dto.BrandDto;
import com.example.store.dto.PartDto;
import lombok.Data;

import java.util.List;

@Data
public class PartResponse {
    private List<PartDto> parts;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
