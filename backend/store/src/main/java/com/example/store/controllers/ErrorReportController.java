package com.example.store.controllers;

import com.example.store.models.ErrorReport;
import com.example.store.service.ErrorReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/error-reports")
@CrossOrigin(origins = {"http://localhost:5173", "http://10.5.29.21:8081","http://192.168.88.1:8081" , "http://localhost:8081"})
public class ErrorReportController {

    private final ErrorReportService errorReportService;

    @Autowired
    public ErrorReportController(ErrorReportService errorReportService) {
        this.errorReportService = errorReportService;
    }

    @PostMapping("/report")
    public ResponseEntity<ErrorReport> reportError(
            @RequestParam String description,
            @RequestParam String userId,
            @RequestParam(required = false) MultipartFile image) throws IOException {

        byte[] imageBytes = null;
        if (image != null && !image.isEmpty()) {
            imageBytes = image.getBytes();
        }

        ErrorReport newErrorReport = errorReportService.reportError(description, userId, imageBytes);
        return new ResponseEntity<>(newErrorReport, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ErrorReport>> getAllReports() {
        List<ErrorReport> reports = errorReportService.getAllReports();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    @PostMapping("/resolve/{id}")
    public ResponseEntity<ErrorReport> resolveError(@PathVariable Long id) {
        ErrorReport resolvedErrorReport = errorReportService.resolveError(id);
        if (resolvedErrorReport != null) {
            return new ResponseEntity<>(resolvedErrorReport, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}