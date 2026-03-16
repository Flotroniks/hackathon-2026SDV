package com.sdv.carbon.dto.calculation;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record CalculationResponse(
        UUID id,
        UUID siteId,
        int versionNo,
        BigDecimal constructionEmissionsKgCo2e,
        BigDecimal operationEmissionsKgCo2e,
        BigDecimal totalEmissionsKgCo2e,
        BigDecimal co2PerM2Kg,
        BigDecimal co2PerEmployeeKg,
        String factorSource,
        OffsetDateTime calculatedAt,
        List<CalculationMaterialBreakdownResponse> materialBreakdown) {
}
