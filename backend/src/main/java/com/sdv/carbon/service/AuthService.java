package com.sdv.carbon.service;

import com.sdv.carbon.domain.model.User;
import com.sdv.carbon.domain.model.enums.UserRole;
import com.sdv.carbon.dto.auth.BootstrapAdminRequest;
import com.sdv.carbon.dto.auth.BootstrapStatusResponse;
import com.sdv.carbon.dto.auth.FirstLoginPasswordChangeRequest;
import com.sdv.carbon.dto.auth.LoginRequest;
import com.sdv.carbon.dto.auth.LoginResponse;
import com.sdv.carbon.exception.BusinessException;
import com.sdv.carbon.mapper.UserMapper;
import com.sdv.carbon.repository.UserRepository;
import com.sdv.carbon.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final DemoSeedService demoSeedService;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String normalizedEmail = request.email().toLowerCase();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.password()));
        User user = userService.getRequiredByEmail(normalizedEmail);
        if (user.isPasswordChangeRequired()) {
            return new LoginResponse(
                    null,
                    "Bearer",
                    userMapper.toResponse(user),
                    true);
        }

        String token = jwtTokenProvider.generateToken(authentication);
        return new LoginResponse(
                token,
                "Bearer",
                userMapper.toResponse(user),
                false);
    }

    @Transactional(readOnly = true)
    public BootstrapStatusResponse bootstrapStatus() {
        return new BootstrapStatusResponse(userRepository.count() == 0);
    }

    @Transactional
    public LoginResponse bootstrapFirstAdmin(BootstrapAdminRequest request) {
        if (userRepository.count() > 0) {
            throw new BusinessException("Bootstrap is already completed");
        }

        User user = new User();
        user.setEmail(request.email().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setRole(UserRole.ADMIN);
        user.setActive(true);
        user.setPasswordChangeRequired(false);
        userRepository.save(user);
        demoSeedService.seedForFirstAdmin(user.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), request.password()));
        String token = jwtTokenProvider.generateToken(authentication);

        return new LoginResponse(
                token,
                "Bearer",
                userMapper.toResponse(user),
                false);
    }

    @Transactional
    public LoginResponse changeFirstLoginPassword(FirstLoginPasswordChangeRequest request) {
        String normalizedEmail = request.email().toLowerCase();
        User user = userService.getRequiredByEmail(normalizedEmail);

        if (user.getRole() != UserRole.ADMIN || !user.isPasswordChangeRequired()) {
            throw new BusinessException("First login password change is not required");
        }
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Current password is invalid");
        }
        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new BusinessException("New password must be different from current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setPasswordChangeRequired(false);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.newPassword()));
        String token = jwtTokenProvider.generateToken(authentication);

        return new LoginResponse(
                token,
                "Bearer",
                userMapper.toResponse(user),
                false);
    }
}
