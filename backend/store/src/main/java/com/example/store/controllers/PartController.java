package com.example.store.controllers;

import com.example.store.dto.PartDto;
import com.example.store.dto.responses.PartResponse;
import com.example.store.service.PartService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/")
@CrossOrigin(origins = {"http://localhost:5173", "http://192.168.100.19:8081" , "http://localhost:8081"})
public class PartController {
    private PartService partService;

    public PartController(PartService partService) {
        this.partService = partService;
    }

    @PostMapping("part/create")
    public ResponseEntity<PartDto> createPart(@RequestBody PartDto partDto) {
        return new ResponseEntity<>(partService.createPart(partDto), HttpStatus.CREATED);
    }


    @GetMapping("partPageable")
    public ResponseEntity<PartResponse> getAllPartsPageable(
            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
    ) {
        return new ResponseEntity<>(partService.getAllPartsPageable(pageNo, pageSize), HttpStatus.OK);
    }
    @GetMapping("part")
    public ResponseEntity<List<PartDto>> getAllParts() {
        return new ResponseEntity<>(partService.getAllParts(), HttpStatus.OK);
    }


//    @GetMapping("part/category/all")
//    public ResponseEntity<PartResponse> getAllPartsByCategory(

//            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
//            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
//    ) {
//        return new ResponseEntity<>(partService.getAllParts(pageNo, pageSize), HttpStatus.OK);
//    }

    @GetMapping("part/category/{categoryId}")
    public ResponseEntity<PartResponse> getPartsByCategory(
            @PathVariable Integer categoryId,
            @RequestParam(value = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize
    ) {
        PartResponse partResponse = partService.getPartsByCategory(categoryId, pageNo, pageSize);
        return new ResponseEntity<>(partResponse, HttpStatus.OK);
    }

    @GetMapping("part/{id}")
    public ResponseEntity<PartDto> getPartById(@PathVariable Long id) {
        return new ResponseEntity<>(partService.getPartById(id), HttpStatus.OK);
    }

    @PutMapping("part/{id}/update")
    public ResponseEntity<PartDto> updatePart(@PathVariable Long id, @RequestBody PartDto partDto) {
        PartDto response = partService.updatePart(id, partDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("part/{id}/delete")
    public ResponseEntity<String> deletePart(@PathVariable Long id) {
        partService.deletePart(id);
        return new ResponseEntity<>("Part deleted", HttpStatus.OK);
    }

    @PutMapping("part/{id}/updateImg")
    public ResponseEntity<PartDto> updatePartImage(@PathVariable Long id, @RequestBody MultipartFile img) throws IOException {
        PartDto response = partService.updatePartImg(id, img);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("partsCount")
    public ResponseEntity<Integer> getPartsCount() {
        int partCount = partService.getPartsCount();
        return ResponseEntity.ok(partCount);
    }

    @GetMapping("part/search")
    public ResponseEntity<List<PartDto>> searchPartsByName(
            @RequestParam(value = "search") String search,
            @RequestParam(value = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize
    ) {
        List<PartDto> parts = partService.searchPartsByName(search, pageNo, pageSize);
        return new ResponseEntity<>(parts, HttpStatus.OK);
    }
}