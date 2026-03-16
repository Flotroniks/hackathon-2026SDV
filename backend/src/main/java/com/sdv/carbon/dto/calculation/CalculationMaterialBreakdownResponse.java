package com.sdv.carbon.dto.calculation;

import com.sdv.carbon.domain.model.enums.MaterialType;
import java.math.BigDecimal;
import java.util.UUID;

public record CalculationMaterialBreakdownResponse(
        UUID id,
        MaterialType materialType,
        String materialLabel,
        BigDecimal quantity,
        String unit,
        BigDecimal emissionFactorKgCo2ePerUnit,
        BigDecimal emissionKgCo2e) {
}
