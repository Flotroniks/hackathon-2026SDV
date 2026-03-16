package com.sdv.carbon.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EmissionTrendPointResponse(
        LocalDate day,
        BigDecimal totalEmissionsKgCo2e) {
}
