package com.sdv.carbon.dto.user;

import com.sdv.carbon.domain.model.enums.UserRole;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String fullName,
        UserRole role,
        boolean active,
        boolean passwordChangeRequired) {
}
