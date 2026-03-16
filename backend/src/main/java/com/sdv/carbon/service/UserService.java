package com.sdv.carbon.service;

import com.sdv.carbon.domain.model.User;
import com.sdv.carbon.dto.user.UserCreateRequest;
import com.sdv.carbon.dto.user.UserResponse;
import com.sdv.carbon.dto.user.UserUpdateRequest;
import com.sdv.carbon.exception.BusinessException;
import com.sdv.carbon.exception.ResourceNotFoundException;
import com.sdv.carbon.mapper.UserMapper;
import com.sdv.carbon.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse create(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.email().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setRole(request.role());
        user.setActive(true);
        user.setPasswordChangeRequired(false);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listActiveUsers() {
        return userRepository.findByActiveTrueOrderByFullNameAsc().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Transactional
    public UserResponse update(UUID userId, UserUpdateRequest request) {
        User user = getRequiredById(userId);
        user.setFullName(request.fullName());
        user.setRole(request.role());
        user.setActive(request.active());
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void deactivate(UUID userId) {
        User user = getRequiredById(userId);
        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        return userMapper.toResponse(getRequiredByEmail(email));
    }

    @Transactional(readOnly = true)
    public User getRequiredByEmail(String email) {
        return userRepository.findByEmail(email)
                .filter(User::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional(readOnly = true)
    public User getRequiredById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
