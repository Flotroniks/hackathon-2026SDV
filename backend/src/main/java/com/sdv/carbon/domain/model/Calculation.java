package com.sdv.carbon.domain.model;

import com.sdv.carbon.domain.model.enums.EnergySource;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "calculations")
@Getter
@Setter
@NoArgsConstructor
public class Calculation {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @Column(name = "version_no", nullable = false)
    private int versionNo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "calculated_by", nullable = false)
    private User calculatedBy;

    @Column(name = "annual_energy_consumption_kwh_snapshot", nullable = false, precision = 14, scale = 2)
    private BigDecimal annualEnergyConsumptionKwhSnapshot;

    @Enumerated(EnumType.STRING)
    @Column(name = "energy_source_snapshot", nullable = false, length = 50)
    private EnergySource energySourceSnapshot;

    @Column(name = "energy_factor_kg_co2e_per_kwh", nullable = false, precision = 14, scale = 6)
    private BigDecimal energyFactorKgCo2ePerKwh;

    @Column(name = "construction_emissions_kg_co2e", nullable = false, precision = 14, scale = 3)
    private BigDecimal constructionEmissionsKgCo2e;

    @Column(name = "operation_emissions_kg_co2e", nullable = false, precision = 14, scale = 3)
    private BigDecimal operationEmissionsKgCo2e;

    @Column(name = "total_emissions_kg_co2e", nullable = false, precision = 14, scale = 3)
    private BigDecimal totalEmissionsKgCo2e;

    @Column(name = "co2_per_m2_kg", nullable = false, precision = 14, scale = 6)
    private BigDecimal co2PerM2Kg;

    @Column(name = "co2_per_employee_kg", precision = 14, scale = 6)
    private BigDecimal co2PerEmployeeKg;

    @Column(name = "factor_source", nullable = false, length = 100)
    private String factorSource;

    @OneToMany(mappedBy = "calculation", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("materialLabel ASC")
    private List<CalculationMaterialSnapshot> materialSnapshots = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
