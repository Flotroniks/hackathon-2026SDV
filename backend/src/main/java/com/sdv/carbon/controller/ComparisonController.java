package com.sdv.carbon.controller;

import com.sdv.carbon.dto.calculation.ComparisonRequest;
import com.sdv.carbon.dto.calculation.ComparisonResponse;
import com.sdv.carbon.service.ComparisonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/comparisons")
@RequiredArgsConstructor
public class ComparisonController {

    private final ComparisonService comparisonService;

    @PostMapping("/sites")
    public ResponseEntity<ComparisonResponse> compare(@Valid @RequestBody ComparisonRequest request) {
        return ResponseEntity.ok(comparisonService.compare(request));
    }
}
