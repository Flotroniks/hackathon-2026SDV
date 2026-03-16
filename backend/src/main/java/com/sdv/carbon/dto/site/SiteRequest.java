package com.sdv.carbon.dto.site;

import com.sdv.carbon.domain.model.enums.EnergySource;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record SiteRequest(
        @NotBlank String name,
        @NotBlank String code,
        String address,
        String city,
        @NotBlank String country,
        @NotNull @DecimalMin("0.01") BigDecimal totalAreaM2,
        @Min(0) int parkingSpaces,
        @NotNull @DecimalMin("0.0") BigDecimal annualEnergyConsumptionKwh,
        @NotNull EnergySource energySource,
        @Min(0) int employeeCount,
        @Valid @NotEmpty List<MaterialInput> materials) {
}
