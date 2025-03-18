package com.example.store.service;

import com.example.store.dto.PartDto;
import com.example.store.dto.responses.PartResponse;
import com.example.store.models.Part;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PartService {
    PartDto createPart(PartDto partDto);

    Integer getPartsCount();
    PartResponse getAllPartsPageable(int pageNo, int pageSize);
    List<PartDto> getAllParts();

    PartDto getPartById(Long id);
    List<PartDto> searchPartsByName(String search, int pageNo, int pageSize);

    PartResponse getPartsByCategory(Integer categoryId, int pageNo, int pageSize);

    PartDto updatePart(Long id ,PartDto partDto);

    void deletePart(Long id);

    PartDto mapPartToDto(Part part);

    PartDto updatePartImg(Long id, MultipartFile img) throws IOException;

//    void putPartInTransaction(Long partId, Long transactionId);
}
