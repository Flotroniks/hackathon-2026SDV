package com.sdv.carbon.dto.calculation;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record ComparisonRequest(
        @NotEmpty @Size(min = 2, max = 5) List<UUID> siteIds) {
}
