package com.example.store.service.implementation;

import com.example.store.models.ErrorReport;
import com.example.store.repository.ErrorReportRepository;
import com.example.store.service.ErrorReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ErrorReportServiceImpl implements ErrorReportService {

    private final ErrorReportRepository errorReportRepository;

    @Autowired
    public ErrorReportServiceImpl(ErrorReportRepository errorReportRepository) {
        this.errorReportRepository = errorReportRepository;
    }

    @Override
    public ErrorReport reportError(String description, String userId, byte[] image) {
        // Tworzymy nowe zgłoszenie błędu
        ErrorReport errorReport = new ErrorReport(description, userId, image);
        return errorReportRepository.save(errorReport);
    }

    @Override
    public List<ErrorReport> getAllReports() {
        // Pobieramy wszystkie zgłoszenia błędów
        return errorReportRepository.findAll();
    }

    @Override
    public ErrorReport resolveError(Long reportId) {
        // Rozwiązujemy błąd (zmiana statusu na "RESOLVED")
        Optional<ErrorReport> errorReport = errorReportRepository.findById(reportId);
        if (errorReport.isPresent()) {
            ErrorReport report = errorReport.get();
            report.setStatus("RESOLVED");
            report.setResolvedAt(java.time.LocalDateTime.now());
            return errorReportRepository.save(report);
        }
        return null;
    }
}