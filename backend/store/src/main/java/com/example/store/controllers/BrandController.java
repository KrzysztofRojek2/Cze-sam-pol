package com.example.store.controllers;

import com.example.store.dto.BrandDto;
import com.example.store.dto.responses.BrandResponse;
import com.example.store.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/")
@CrossOrigin(origins = "http://localhost:5173")
public class BrandController {

    private BrandService brandService;

    @Autowired
    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @PostMapping("brand/create")
    public ResponseEntity<BrandDto> create(@RequestBody BrandDto brandDto) {
        return new ResponseEntity<>(brandService.createBrand(brandDto), HttpStatus.CREATED);
    }

//    @GetMapping("brand")
//    public ResponseEntity<BrandResponse> getAll(
//            @RequestParam(value = "pageNo", defaultValue = "0", required = false) int pageNo,
//            @RequestParam(value = "pageSize", defaultValue = "10", required = false) int pageSize
//    ) {
//        return new ResponseEntity<>(brandService.getAllBrands(pageNo, pageSize), HttpStatus.OK);
//    }
    @GetMapping("brand")
    public ResponseEntity<List<BrandDto>> getAll(){
        return new ResponseEntity<>(brandService.getAllBrands(), HttpStatus.OK);
    }

    @GetMapping("brand/{id}")
    public ResponseEntity<BrandDto> getById(@PathVariable int id) {
        return new ResponseEntity<>(brandService.getBrandById(id), HttpStatus.OK);
    }

    @PutMapping("brand/{id}/update")
    public ResponseEntity<BrandDto> update(@PathVariable int id, @RequestBody BrandDto brandDto) {
        BrandDto response = brandService.updateBrand(brandDto, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("brand/{id}/delete")
    public ResponseEntity<String> delete(@PathVariable int id) {
        brandService.deleteBrand(id);
        return new ResponseEntity<>("Brand deleted", HttpStatus.OK);
    }

    @GetMapping("brandsCount")
    public ResponseEntity<Integer> getBrandsCount() {
        int brandsCount = brandService.getBrandsCount();
        return ResponseEntity.ok(brandsCount);
    }
}
