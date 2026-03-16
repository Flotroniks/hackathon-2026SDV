package com.sdv.carbon.controller;

import com.sdv.carbon.dto.user.UserCreateRequest;
import com.sdv.carbon.dto.user.UserResponse;
import com.sdv.carbon.dto.user.UserUpdateRequest;
import com.sdv.carbon.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> list() {
        return ResponseEntity.ok(userService.listActiveUsers());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> update(@PathVariable UUID userId, @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.update(userId, request));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deactivate(@PathVariable UUID userId) {
        userService.deactivate(userId);
        return ResponseEntity.noContent().build();
    }
}
