package com.sdv.carbon.controller;

import com.sdv.carbon.dto.auth.BootstrapAdminRequest;
import com.sdv.carbon.dto.auth.BootstrapStatusResponse;
import com.sdv.carbon.dto.auth.LoginRequest;
import com.sdv.carbon.dto.auth.LoginResponse;
import com.sdv.carbon.dto.auth.FirstLoginPasswordChangeRequest;
import com.sdv.carbon.dto.user.UserResponse;
import com.sdv.carbon.service.AuthService;
import com.sdv.carbon.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/bootstrap/status")
    public ResponseEntity<BootstrapStatusResponse> bootstrapStatus() {
        return ResponseEntity.ok(authService.bootstrapStatus());
    }

    @PostMapping("/bootstrap/register")
    public ResponseEntity<LoginResponse> bootstrapRegister(@Valid @RequestBody BootstrapAdminRequest request) {
        return ResponseEntity.ok(authService.bootstrapFirstAdmin(request));
    }

    @PostMapping("/first-login/change-password")
    public ResponseEntity<LoginResponse> changeFirstLoginPassword(
            @Valid @RequestBody FirstLoginPasswordChangeRequest request) {
        return ResponseEntity.ok(authService.changeFirstLoginPassword(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        return ResponseEntity.ok(userService.getCurrentUser(authentication.getName()));
    }
}
