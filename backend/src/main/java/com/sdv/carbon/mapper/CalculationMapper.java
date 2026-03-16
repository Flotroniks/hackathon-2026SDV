package com.sdv.carbon.mapper;

import com.sdv.carbon.domain.model.Calculation;
import com.sdv.carbon.domain.model.CalculationMaterialSnapshot;
import com.sdv.carbon.dto.calculation.CalculationHistoryItemResponse;
import com.sdv.carbon.dto.calculation.CalculationMaterialBreakdownResponse;
import com.sdv.carbon.dto.calculation.CalculationResponse;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CalculationMapper {

    public CalculationHistoryItemResponse toHistoryItem(Calculation calculation) {
        return new CalculationHistoryItemResponse(
                calculation.getId(),
                calculation.getVersionNo(),
                calculation.getTotalEmissionsKgCo2e(),
                calculation.getConstructionEmissionsKgCo2e(),
                calculation.getOperationEmissionsKgCo2e(),
                calculation.getCreatedAt());
    }

    public CalculationResponse toResponse(Calculation calculation) {
        List<CalculationMaterialBreakdownResponse> breakdown = calculation.getMaterialSnapshots()
                .stream()
                .map(this::toBreakdown)
                .toList();

        return new CalculationResponse(
                calculation.getId(),
                calculation.getSite().getId(),
                calculation.getVersionNo(),
                calculation.getConstructionEmissionsKgCo2e(),
                calculation.getOperationEmissionsKgCo2e(),
                calculation.getTotalEmissionsKgCo2e(),
                calculation.getCo2PerM2Kg(),
                calculation.getCo2PerEmployeeKg(),
                calculation.getFactorSource(),
                calculation.getCreatedAt(),
                breakdown);
    }

    private CalculationMaterialBreakdownResponse toBreakdown(CalculationMaterialSnapshot snapshot) {
        return new CalculationMaterialBreakdownResponse(
                snapshot.getId(),
                snapshot.getMaterialType(),
                snapshot.getMaterialLabel(),
                snapshot.getQuantity(),
                snapshot.getUnit(),
                snapshot.getEmissionFactorKgCo2ePerUnit(),
                snapshot.getEmissionKgCo2e());
    }
}
