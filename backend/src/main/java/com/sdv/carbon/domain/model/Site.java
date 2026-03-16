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
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "sites")
@Getter
@Setter
@NoArgsConstructor
public class Site {

    @Id
    @GeneratedValue
    @UuidGenerator
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    private String address;

    private String city;

    @Column(nullable = false, length = 100)
    private String country = "France";

    @Column(name = "total_area_m2", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAreaM2;

    @Column(name = "parking_spaces", nullable = false)
    private int parkingSpaces;

    @Column(name = "annual_energy_consumption_kwh", nullable = false, precision = 14, scale = 2)
    private BigDecimal annualEnergyConsumptionKwh;

    @Enumerated(EnumType.STRING)
    @Column(name = "energy_source", nullable = false, length = 50)
    private EnergySource energySource;

    @Column(name = "employee_count", nullable = false)
    private int employeeCount;

    @Column(nullable = false)
    private boolean archived = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "site", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SiteMaterial> materials = new ArrayList<>();

    @OneToMany(mappedBy = "site")
    @OrderBy("versionNo DESC")
    private List<Calculation> calculations = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
