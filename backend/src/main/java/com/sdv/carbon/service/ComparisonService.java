package com.sdv.carbon.service;

import com.sdv.carbon.domain.model.Calculation;
import com.sdv.carbon.domain.model.Site;
import com.sdv.carbon.dto.calculation.ComparisonRequest;
import com.sdv.carbon.dto.calculation.ComparisonResponse;
import com.sdv.carbon.dto.calculation.ComparisonSiteItemResponse;
import com.sdv.carbon.exception.BusinessException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ComparisonService {

    private final SiteService siteService;
    private final CarbonCalculationService carbonCalculationService;

    @Transactional(readOnly = true)
    public ComparisonResponse compare(ComparisonRequest request) {
        List<UUID> distinctSiteIds = request.siteIds().stream().distinct().toList();
        if (distinctSiteIds.size() < 2) {
            throw new BusinessException("At least 2 distinct sites are required for comparison");
        }

        List<ComparisonSiteItemResponse> items = distinctSiteIds.stream()
                .map(this::toItem)
                .toList();

        BigDecimal average = items.stream()
                .map(ComparisonSiteItemResponse::totalEmissionsKgCo2e)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(items.size()), 3, RoundingMode.HALF_UP);

        UUID lowestEmissionSiteId = items.stream()
                .min((left, right) -> left.totalEmissionsKgCo2e().compareTo(right.totalEmissionsKgCo2e()))
                .map(ComparisonSiteItemResponse::siteId)
                .orElse(null);

        return new ComparisonResponse(items, lowestEmissionSiteId, average);
    }

    private ComparisonSiteItemResponse toItem(UUID siteId) {
        Site site = siteService.getActiveSite(siteId);
        Calculation latestCalculation = carbonCalculationService.getLatestCalculationEntity(siteId);
        if (latestCalculation == null) {
            throw new BusinessException("Site " + site.getName() + " has no calculation yet");
        }
        return new ComparisonSiteItemResponse(
                site.getId(),
                site.getName(),
                site.getCode(),
                latestCalculation.getId(),
                latestCalculation.getTotalEmissionsKgCo2e(),
                latestCalculation.getConstructionEmissionsKgCo2e(),
                latestCalculation.getOperationEmissionsKgCo2e(),
                latestCalculation.getCo2PerM2Kg(),
                latestCalculation.getCo2PerEmployeeKg(),
                latestCalculation.getCreatedAt());
    }
}
