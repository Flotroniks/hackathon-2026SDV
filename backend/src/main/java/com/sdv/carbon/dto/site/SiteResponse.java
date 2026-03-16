package com.sdv.carbon.dto.site;

import com.sdv.carbon.domain.model.enums.EnergySource;
import com.sdv.carbon.dto.calculation.CalculationHistoryItemResponse;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record SiteResponse(
        UUID id,
        String name,
        String code,
        String address,
        String city,
        String country,
        BigDecimal totalAreaM2,
        int parkingSpaces,
        BigDecimal annualEnergyConsumptionKwh,
        EnergySource energySource,
        int employeeCount,
        boolean archived,
        List<SiteMaterialResponse> materials,
        CalculationHistoryItemResponse latestCalculation,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt) {
}
