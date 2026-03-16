package com.sdv.carbon.dto.dashboard;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record TopSiteResponse(
        UUID siteId,
        String siteName,
        String siteCode,
        BigDecimal totalEmissionsKgCo2e,
        BigDecimal co2PerM2Kg,
        OffsetDateTime calculatedAt) {
}
