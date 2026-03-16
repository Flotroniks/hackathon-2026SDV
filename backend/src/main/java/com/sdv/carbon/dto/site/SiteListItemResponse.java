package com.sdv.carbon.dto.site;

import com.sdv.carbon.domain.model.enums.EnergySource;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record SiteListItemResponse(
        UUID id,
        String name,
        String code,
        String city,
        BigDecimal totalAreaM2,
        int employeeCount,
        EnergySource energySource,
        BigDecimal latestTotalEmissionsKgCo2e,
        OffsetDateTime latestCalculatedAt) {
}
