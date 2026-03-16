package com.sdv.carbon.repository;

import com.sdv.carbon.domain.model.CalculationMaterialSnapshot;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalculationMaterialSnapshotRepository extends JpaRepository<CalculationMaterialSnapshot, UUID> {
}
