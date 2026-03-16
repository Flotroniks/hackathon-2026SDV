package com.sdv.carbon.mapper;

import com.sdv.carbon.domain.model.Calculation;
import com.sdv.carbon.domain.model.Site;
import com.sdv.carbon.domain.model.SiteMaterial;
import com.sdv.carbon.dto.calculation.CalculationHistoryItemResponse;
import com.sdv.carbon.dto.site.SiteListItemResponse;
import com.sdv.carbon.dto.site.SiteMaterialResponse;
import com.sdv.carbon.dto.site.SiteResponse;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class SiteMapper {

    private final CalculationMapper calculationMapper;

    public SiteMapper(CalculationMapper calculationMapper) {
        this.calculationMapper = calculationMapper;
    }

    public SiteResponse toResponse(Site site, Calculation latestCalculation) {
        CalculationHistoryItemResponse latest = latestCalculation == null ? null : calculationMapper.toHistoryItem(latestCalculation);
        List<SiteMaterialResponse> materials = site.getMaterials().stream()
                .map(this::toMaterialResponse)
                .toList();
        return new SiteResponse(
                site.getId(),
                site.getName(),
                site.getCode(),
                site.getAddress(),
                site.getCity(),
                site.getCountry(),
                site.getTotalAreaM2(),
                site.getParkingSpaces(),
                site.getAnnualEnergyConsumptionKwh(),
                site.getEnergySource(),
                site.getEmployeeCount(),
                site.isArchived(),
                materials,
                latest,
                site.getCreatedAt(),
                site.getUpdatedAt());
    }

    public SiteListItemResponse toListItem(Site site, Calculation latestCalculation) {
        return new SiteListItemResponse(
                site.getId(),
                site.getName(),
                site.getCode(),
                site.getCity(),
                site.getTotalAreaM2(),
                site.getEmployeeCount(),
                site.getEnergySource(),
                latestCalculation == null ? null : latestCalculation.getTotalEmissionsKgCo2e(),
                latestCalculation == null ? null : latestCalculation.getCreatedAt());
    }

    private SiteMaterialResponse toMaterialResponse(SiteMaterial material) {
        return new SiteMaterialResponse(
                material.getId(),
                material.getMaterialType(),
                material.getMaterialLabel(),
                material.getQuantity(),
                material.getUnit(),
                material.getEmissionFactorKgCo2ePerUnit(),
                material.getFactorSource());
    }
}
