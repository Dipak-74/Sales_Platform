package com.example.Sales_Platform.Services;

import java.time.LocalDate;
import com.example.Sales_Platform.DTO.AnalyticsResponseDTO;

public interface AnalyticsServices {
    AnalyticsResponseDTO getAnalytics(LocalDate startDate, LocalDate endDate);
}
