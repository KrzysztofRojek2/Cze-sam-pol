package com.example.store.service;

import com.example.store.models.ErrorReport;

import java.util.List;

public interface ErrorReportService {
    ErrorReport reportError(String description, String userId, byte[] image);
    List<ErrorReport> getAllReports();
    ErrorReport resolveError(Long reportId);
}
