package com.example.store.dto.responses;

import com.example.store.dto.BrandDto;
import com.example.store.dto.ReviewDto;
import lombok.Data;

import java.util.List;

@Data
public class ReviewResponse {
    private List<ReviewDto> reviews;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
