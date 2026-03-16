package com.sdv.carbon.dto.dashboard;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        long siteCount,
        long calculationCount,
        BigDecimal totalEmissionsKgCo2e,
        BigDecimal averageCo2PerM2Kg,
        BigDecimal totalConstructionEmissionsKgCo2e,
        BigDecimal totalOperationEmissionsKgCo2e) {
}
