package com.sdv.carbon.dto.calculation;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record CalculationHistoryItemResponse(
        UUID id,
        int versionNo,
        BigDecimal totalEmissionsKgCo2e,
        BigDecimal constructionEmissionsKgCo2e,
        BigDecimal operationEmissionsKgCo2e,
        OffsetDateTime calculatedAt) {
}
