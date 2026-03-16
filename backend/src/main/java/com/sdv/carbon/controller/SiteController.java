package com.sdv.carbon.controller;

import com.sdv.carbon.dto.common.PageResponse;
import com.sdv.carbon.dto.site.SiteListItemResponse;
import com.sdv.carbon.dto.site.SiteRequest;
import com.sdv.carbon.dto.site.SiteResponse;
import com.sdv.carbon.service.SiteService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/sites")
@RequiredArgsConstructor
public class SiteController {

    private final SiteService siteService;

    @GetMapping
    public ResponseEntity<PageResponse<SiteListItemResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(siteService.list(page, size));
    }

    @GetMapping("/{siteId}")
    public ResponseEntity<SiteResponse> get(@PathVariable UUID siteId) {
        return ResponseEntity.ok(siteService.get(siteId));
    }

    @PostMapping
    public ResponseEntity<SiteResponse> create(@Valid @RequestBody SiteRequest request, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(siteService.create(request, authentication.getName()));
    }

    @PutMapping("/{siteId}")
    public ResponseEntity<SiteResponse> update(@PathVariable UUID siteId, @Valid @RequestBody SiteRequest request) {
        return ResponseEntity.ok(siteService.update(siteId, request));
    }

    @DeleteMapping("/{siteId}")
    public ResponseEntity<Void> archive(@PathVariable UUID siteId) {
        siteService.archive(siteId);
        return ResponseEntity.noContent().build();
    }
}
