package com.sdv.carbon.dto.site;

import com.sdv.carbon.domain.model.enums.MaterialType;
import java.math.BigDecimal;
import java.util.UUID;

public record SiteMaterialResponse(
        UUID id,
        MaterialType materialType,
        String materialLabel,
        BigDecimal quantity,
        String unit,
        BigDecimal emissionFactorKgCo2ePerUnit,
        String factorSource) {
}
