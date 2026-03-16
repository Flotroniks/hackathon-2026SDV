package com.sdv.carbon.service;

import com.sdv.carbon.domain.model.enums.EnergySource;
import com.sdv.carbon.domain.model.enums.MaterialType;
import com.sdv.carbon.dto.site.MaterialInput;
import com.sdv.carbon.dto.site.SiteRequest;
import com.sdv.carbon.dto.site.SiteResponse;
import com.sdv.carbon.repository.SiteRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DemoSeedService {

    private final SiteRepository siteRepository;
    private final SiteService siteService;
    private final CarbonCalculationService carbonCalculationService;

    @Transactional
    public void seedForFirstAdmin(String adminEmail) {
        if (siteRepository.countByArchivedFalse() > 0) {
            return;
        }

        SiteResponse hqParis = siteService.create(new SiteRequest(
                "HQ Paris Montparnasse",
                "PAR-HQ-01",
                "54 Boulevard de Vaugirard",
                "Paris",
                "France",
                bd("4200"),
                48,
                bd("510000"),
                EnergySource.ELECTRICITY_GRID,
                260,
                List.of(
                        material(MaterialType.CONCRETE, "Concrete foundations", "180000", "kg"),
                        material(MaterialType.STEEL, "Structural steel", "38", "ton"),
                        material(MaterialType.GLASS, "Curtain wall glazing", "14000", "kg"),
                        material(MaterialType.WOOD, "Interior CLT partitions", "120", "m3"),
                        material(MaterialType.ALUMINUM, "Window frames", "3200", "kg")
                )), adminEmail);
        carbonCalculationService.calculate(hqParis.id(), adminEmail);

        SiteResponse lilleHub = siteService.create(new SiteRequest(
                "Lille Logistics Hub",
                "LIL-LOG-01",
                "18 Rue du Port Fluvial",
                "Lille",
                "France",
                bd("12500"),
                180,
                bd("890000"),
                EnergySource.NATURAL_GAS,
                95,
                List.of(
                        material(MaterialType.CONCRETE, "Slab and foundations", "520000", "kg"),
                        material(MaterialType.STEEL, "Warehouse frame", "120", "ton"),
                        material(MaterialType.BRICK, "Perimeter walls", "340000", "kg"),
                        material(MaterialType.WOOD, "Dock office fit-out", "60", "m3")
                )), adminEmail);
        carbonCalculationService.calculate(lilleHub.id(), adminEmail);

        SiteResponse lyonStore = siteService.create(new SiteRequest(
                "Lyon Retail Flagship",
                "LYO-RET-01",
                "27 Rue de la République",
                "Lyon",
                "France",
                bd("2800"),
                0,
                bd("250000"),
                EnergySource.DISTRICT_HEATING,
                75,
                List.of(
                        material(MaterialType.CONCRETE, "Core and slab", "95000", "kg"),
                        material(MaterialType.STEEL, "Canopy structure", "22", "ton"),
                        material(MaterialType.GLASS, "Facade glazing", "12000", "kg"),
                        material(MaterialType.ALUMINUM, "Storefront frames", "1800", "kg"),
                        material(MaterialType.WOOD, "Interior furniture", "35", "m3")
                )), adminEmail);
        carbonCalculationService.calculate(lyonStore.id(), adminEmail);
    }

    private static MaterialInput material(MaterialType type, String label, String quantity, String unit) {
        return new MaterialInput(type, label, bd(quantity), unit);
    }

    private static BigDecimal bd(String value) {
        return new BigDecimal(value);
    }
}
