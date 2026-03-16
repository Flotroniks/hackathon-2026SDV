package com.sdv.carbon.mapper;

import com.sdv.carbon.domain.model.User;
import com.sdv.carbon.dto.user.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.isActive(),
                user.isPasswordChangeRequired());
    }
}
