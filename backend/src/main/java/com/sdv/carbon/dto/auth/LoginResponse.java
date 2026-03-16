package com.sdv.carbon.dto.auth;

import com.sdv.carbon.dto.user.UserResponse;

public record LoginResponse(
        String accessToken,
        String tokenType,
        UserResponse user,
        boolean passwordChangeRequired) {
}
