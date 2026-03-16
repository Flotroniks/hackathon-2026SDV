package com.sdv.carbon.dto.site;

import com.sdv.carbon.domain.model.enums.MaterialType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record MaterialInput(
        @NotNull MaterialType materialType,
        @NotBlank String materialLabel,
        @NotNull @DecimalMin("0.001") BigDecimal quantity,
        @NotBlank String unit) {
}
