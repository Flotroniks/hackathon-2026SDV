package com.sdv.carbon.service;

import com.sdv.carbon.domain.model.Calculation;
import com.sdv.carbon.domain.model.CalculationMaterialSnapshot;
import com.sdv.carbon.domain.model.Site;
import com.sdv.carbon.domain.model.SiteMaterial;
import com.sdv.carbon.domain.model.User;
import com.sdv.carbon.dto.calculation.CalculationHistoryItemResponse;
import com.sdv.carbon.dto.calculation.CalculationResponse;
import com.sdv.carbon.exception.ResourceNotFoundException;
import com.sdv.carbon.mapper.CalculationMapper;
import com.sdv.carbon.provider.EmissionFactorProvider;
import com.sdv.carbon.provider.EnergyFactor;
import com.sdv.carbon.repository.CalculationRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CarbonCalculationService {

    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private final CalculationRepository calculationRepository;
    private final SiteService siteService;
    private final UserService userService;
    private final EmissionFactorProvider emissionFactorProvider;
    private final CalculationMapper calculationMapper;

    @Transactional
    public CalculationResponse calculate(UUID siteId, String currentUserEmail) {
        Site site = siteService.getActiveSite(siteId);
        User user = userService.getRequiredByEmail(currentUserEmail);
        int nextVersion = calculationRepository.findTopBySiteIdOrderByVersionNoDesc(siteId)
                .map(calculation -> calculation.getVersionNo() + 1)
                .orElse(1);

        BigDecimal constructionEmissions = ZERO;
        List<CalculationMaterialSnapshot> snapshots = new ArrayList<>();
        for (SiteMaterial material : site.getMaterials()) {
            BigDecimal emission = material.getQuantity()
                    .multiply(material.getEmissionFactorKgCo2ePerUnit())
                    .setScale(3, RoundingMode.HALF_UP);
            constructionEmissions = constructionEmissions.add(emission);

            CalculationMaterialSnapshot snapshot = new CalculationMaterialSnapshot();
            snapshot.setMaterialType(material.getMaterialType());
            snapshot.setMaterialLabel(material.getMaterialLabel());
            snapshot.setQuantity(material.getQuantity());
            snapshot.setUnit(material.getUnit());
            snapshot.setEmissionFactorKgCo2ePerUnit(material.getEmissionFactorKgCo2ePerUnit());
            snapshot.setEmissionKgCo2e(emission);
            snapshots.add(snapshot);
        }

        EnergyFactor energyFactor = emissionFactorProvider.getEnergyFactor(site.getEnergySource());
        BigDecimal operationEmissions = site.getAnnualEnergyConsumptionKwh()
                .multiply(energyFactor.valueKgCo2ePerKwh())
                .setScale(3, RoundingMode.HALF_UP);
        BigDecimal totalEmissions = constructionEmissions.add(operationEmissions).setScale(3, RoundingMode.HALF_UP);
        BigDecimal co2PerM2 = totalEmissions
                .divide(site.getTotalAreaM2(), 6, RoundingMode.HALF_UP);
        BigDecimal co2PerEmployee = site.getEmployeeCount() > 0
                ? totalEmissions.divide(BigDecimal.valueOf(site.getEmployeeCount()), 6, RoundingMode.HALF_UP)
                : null;

        Calculation calculation = new Calculation();
        calculation.setSite(site);
        calculation.setVersionNo(nextVersion);
        calculation.setCalculatedBy(user);
        calculation.setAnnualEnergyConsumptionKwhSnapshot(site.getAnnualEnergyConsumptionKwh());
        calculation.setEnergySourceSnapshot(site.getEnergySource());
        calculation.setEnergyFactorKgCo2ePerKwh(energyFactor.valueKgCo2ePerKwh());
        calculation.setConstructionEmissionsKgCo2e(constructionEmissions);
        calculation.setOperationEmissionsKgCo2e(operationEmissions);
        calculation.setTotalEmissionsKgCo2e(totalEmissions);
        calculation.setCo2PerM2Kg(co2PerM2);
        calculation.setCo2PerEmployeeKg(co2PerEmployee);
        calculation.setFactorSource(emissionFactorProvider.getSourceLabel());

        snapshots.forEach(snapshot -> snapshot.setCalculation(calculation));
        calculation.getMaterialSnapshots().addAll(snapshots);

        return calculationMapper.toResponse(calculationRepository.save(calculation));
    }

    @Transactional(readOnly = true)
    public List<CalculationHistoryItemResponse> getHistory(UUID siteId) {
        siteService.getActiveSite(siteId);
        return calculationRepository.findBySiteIdOrderByVersionNoDesc(siteId).stream()
                .map(calculationMapper::toHistoryItem)
                .toList();
    }

    @Transactional(readOnly = true)
    public CalculationResponse getLatest(UUID siteId) {
        siteService.getActiveSite(siteId);
        Calculation calculation = calculationRepository.findTopBySiteIdOrderByVersionNoDesc(siteId)
                .orElseThrow(() -> new ResourceNotFoundException("No calculation found for site"));
        return calculationMapper.toResponse(calculationRepository.findById(calculation.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Calculation not found")));
    }

    @Transactional(readOnly = true)
    public CalculationResponse getById(UUID calculationId) {
        Calculation calculation = calculationRepository.findById(calculationId)
                .orElseThrow(() -> new ResourceNotFoundException("Calculation not found"));
        return calculationMapper.toResponse(calculation);
    }

    @Transactional(readOnly = true)
    public Calculation getLatestCalculationEntity(UUID siteId) {
        return calculationRepository.findTopBySiteIdOrderByVersionNoDesc(siteId)
                .orElse(null);
    }
}
