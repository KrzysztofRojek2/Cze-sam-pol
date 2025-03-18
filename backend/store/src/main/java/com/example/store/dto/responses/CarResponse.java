package com.example.store.dto.responses;

import com.example.store.dto.CarDto;
import lombok.Data;

import java.util.List;

@Data
public class CarResponse {
    private List<CarDto> cars;
    private int pageNo;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean last;
}
