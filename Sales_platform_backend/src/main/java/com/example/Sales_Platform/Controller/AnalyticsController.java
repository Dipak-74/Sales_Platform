package com.example.Sales_Platform.Controller;

import com.example.Sales_Platform.DTO.AnalyticsResponseDTO;
import com.example.Sales_Platform.Services.AnalyticsServices;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;

@RestController
public class AnalyticsController {
    private final AnalyticsServices analyticsServices;
    public AnalyticsController(AnalyticsServices analyticsServices) { this.analyticsServices = analyticsServices; }

    @GetMapping({"/api/admin/analytics", "/api/manager/analytics"})
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public AnalyticsResponseDTO getAnalytics(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return analyticsServices.getAnalytics(startDate, endDate);
    }
}
