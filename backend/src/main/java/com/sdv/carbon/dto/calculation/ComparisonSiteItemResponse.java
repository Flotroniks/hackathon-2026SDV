package com.sdv.carbon.dto.calculation;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ComparisonSiteItemResponse(
        UUID siteId,
        String siteName,
        String siteCode,
        UUID calculationId,
        BigDecimal totalEmissionsKgCo2e,
        BigDecimal constructionEmissionsKgCo2e,
        BigDecimal operationEmissionsKgCo2e,
        BigDecimal co2PerM2Kg,
        BigDecimal co2PerEmployeeKg,
        OffsetDateTime calculatedAt) {
}
