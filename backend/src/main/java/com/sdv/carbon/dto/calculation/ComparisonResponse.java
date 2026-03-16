package com.sdv.carbon.dto.calculation;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ComparisonResponse(
        List<ComparisonSiteItemResponse> items,
        UUID lowestEmissionSiteId,
        BigDecimal averageTotalEmissionsKgCo2e) {
}
