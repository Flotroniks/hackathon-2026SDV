package com.sdv.carbon.dto.user;

import com.sdv.carbon.domain.model.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UserUpdateRequest(
        @NotBlank String fullName,
        @NotNull UserRole role,
        boolean active) {
}
