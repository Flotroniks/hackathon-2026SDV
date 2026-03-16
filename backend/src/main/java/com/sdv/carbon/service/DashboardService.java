package com.sdv.carbon.service;

import com.sdv.carbon.domain.model.Calculation;
import com.sdv.carbon.domain.model.Site;
import com.sdv.carbon.dto.dashboard.DashboardSummaryResponse;
import com.sdv.carbon.dto.dashboard.EmissionTrendPointResponse;
import com.sdv.carbon.dto.dashboard.TopSiteResponse;
import com.sdv.carbon.repository.CalculationRepository;
import com.sdv.carbon.repository.SiteRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SiteRepository siteRepository;
    private final CalculationRepository calculationRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        List<Calculation> latestCalculations = getLatestCalculationsForActiveSites();
        BigDecimal totalEmissions = latestCalculations.stream()
                .map(Calculation::getTotalEmissionsKgCo2e)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalConstruction = latestCalculations.stream()
                .map(Calculation::getConstructionEmissionsKgCo2e)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalOperation = latestCalculations.stream()
                .map(Calculation::getOperationEmissionsKgCo2e)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal averageCo2PerM2 = latestCalculations.isEmpty()
                ? BigDecimal.ZERO
                : latestCalculations.stream()
                        .map(Calculation::getCo2PerM2Kg)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                        .divide(BigDecimal.valueOf(latestCalculations.size()), 6, RoundingMode.HALF_UP);

        return new DashboardSummaryResponse(
                siteRepository.countByArchivedFalse(),
                calculationRepository.count(),
                totalEmissions,
                averageCo2PerM2,
                totalConstruction,
                totalOperation);
    }

    @Transactional(readOnly = true)
    public List<EmissionTrendPointResponse> getTrend(UUID siteId, LocalDate from, LocalDate to) {
        OffsetDateTime start = from.atStartOfDay().atOffset(OffsetDateTime.now().getOffset());
        OffsetDateTime end = to.plusDays(1).atStartOfDay().atOffset(OffsetDateTime.now().getOffset()).minusSeconds(1);

        List<Calculation> calculations = siteId == null
                ? calculationRepository.findByCreatedAtBetweenOrderByCreatedAtAsc(start, end)
                : calculationRepository.findBySiteIdAndCreatedAtBetweenOrderByCreatedAtAsc(siteId, start, end);

        Map<LocalDate, BigDecimal> grouped = calculations.stream()
                .collect(Collectors.groupingBy(
                        calculation -> calculation.getCreatedAt().toLocalDate(),
                        Collectors.mapping(Calculation::getTotalEmissionsKgCo2e,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));

        return grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new EmissionTrendPointResponse(entry.getKey(), entry.getValue()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TopSiteResponse> getTopSites(int limit) {
        return getLatestCalculationsForActiveSites().stream()
                .sorted(Comparator.comparing(Calculation::getTotalEmissionsKgCo2e).reversed())
                .limit(limit)
                .map(calculation -> new TopSiteResponse(
                        calculation.getSite().getId(),
                        calculation.getSite().getName(),
                        calculation.getSite().getCode(),
                        calculation.getTotalEmissionsKgCo2e(),
                        calculation.getCo2PerM2Kg(),
                        calculation.getCreatedAt()))
                .toList();
    }

    private List<Calculation> getLatestCalculationsForActiveSites() {
        return siteRepository.findByArchivedFalseOrderByNameAsc().stream()
                .map(site -> calculationRepository.findTopBySiteIdOrderByVersionNoDesc(site.getId()).orElse(null))
                .filter(calculation -> calculation != null)
                .toList();
    }
}
