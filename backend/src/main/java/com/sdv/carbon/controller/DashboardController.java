package com.sdv.carbon.controller;

import com.sdv.carbon.dto.dashboard.DashboardSummaryResponse;
import com.sdv.carbon.dto.dashboard.EmissionTrendPointResponse;
import com.sdv.carbon.dto.dashboard.TopSiteResponse;
import com.sdv.carbon.service.DashboardService;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> summary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/trend")
    public ResponseEntity<List<EmissionTrendPointResponse>> trend(
            @RequestParam(required = false) UUID siteId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        LocalDate resolvedTo = to == null ? LocalDate.now() : to;
        LocalDate resolvedFrom = from == null ? resolvedTo.minusDays(30) : from;
        return ResponseEntity.ok(dashboardService.getTrend(siteId, resolvedFrom, resolvedTo));
    }

    @GetMapping("/top-sites")
    public ResponseEntity<List<TopSiteResponse>> topSites(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getTopSites(limit));
    }
}
