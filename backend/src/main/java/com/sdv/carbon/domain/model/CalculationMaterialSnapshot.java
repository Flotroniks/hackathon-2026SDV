package com.sdv.carbon.domain.model;

import com.sdv.carbon.domain.model.enums.MaterialType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "calculation_material_snapshots")
@Getter
@Setter
@NoArgsConstructor
public class CalculationMaterialSnapshot {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "calculation_id", nullable = false)
    private Calculation calculation;

    @Enumerated(EnumType.STRING)
    @Column(name = "material_type", nullable = false, length = 50)
    private MaterialType materialType;

    @Column(name = "material_label", nullable = false, length = 100)
    private String materialLabel;

    @Column(nullable = false, precision = 14, scale = 3)
    private BigDecimal quantity;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "emission_factor_kg_co2e_per_unit", nullable = false, precision = 14, scale = 6)
    private BigDecimal emissionFactorKgCo2ePerUnit;

    @Column(name = "emission_kg_co2e", nullable = false, precision = 14, scale = 3)
    private BigDecimal emissionKgCo2e;
}
