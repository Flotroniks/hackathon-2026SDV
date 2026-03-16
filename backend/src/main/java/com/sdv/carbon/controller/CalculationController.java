package com.sdv.carbon.controller;

import com.sdv.carbon.dto.calculation.CalculationHistoryItemResponse;
import com.sdv.carbon.dto.calculation.CalculationResponse;
import com.sdv.carbon.service.CarbonCalculationService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CalculationController {

    private final CarbonCalculationService carbonCalculationService;

    @PostMapping("/sites/{siteId}/calculations")
    public ResponseEntity<CalculationResponse> calculate(@PathVariable UUID siteId, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(carbonCalculationService.calculate(siteId, authentication.getName()));
    }

    @GetMapping("/sites/{siteId}/calculations")
    public ResponseEntity<List<CalculationHistoryItemResponse>> history(@PathVariable UUID siteId) {
        return ResponseEntity.ok(carbonCalculationService.getHistory(siteId));
    }

    @GetMapping("/sites/{siteId}/calculations/latest")
    public ResponseEntity<CalculationResponse> latest(@PathVariable UUID siteId) {
        return ResponseEntity.ok(carbonCalculationService.getLatest(siteId));
    }

    @GetMapping("/calculations/{calculationId}")
    public ResponseEntity<CalculationResponse> byId(@PathVariable UUID calculationId) {
        return ResponseEntity.ok(carbonCalculationService.getById(calculationId));
    }
}
