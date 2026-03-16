package com.sdv.carbon.provider;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdv.carbon.domain.model.enums.EnergySource;
import com.sdv.carbon.domain.model.enums.MaterialType;
import com.sdv.carbon.exception.BusinessException;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MockEmissionFactorProvider implements EmissionFactorProvider {

    private final ObjectMapper objectMapper;
    private final Map<MaterialType, Map<String, BigDecimal>> materialFactors = new EnumMap<>(MaterialType.class);
    private final Map<EnergySource, BigDecimal> energyFactors = new EnumMap<>(EnergySource.class);
    private String sourceLabel;

    @PostConstruct
    void loadFactors() {
        try (InputStream inputStream = new ClassPathResource("factors/mock-emission-factors.json").getInputStream()) {
            FactorFile factorFile = objectMapper.readValue(inputStream, FactorFile.class);
            sourceLabel = factorFile.sourceLabel();
            factorFile.materials().forEach((materialKey, units) ->
                    materialFactors.put(MaterialType.valueOf(materialKey), units));
            factorFile.energy().forEach((energyKey, value) ->
                    energyFactors.put(EnergySource.valueOf(energyKey), value));
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to load emission factors", exception);
        }
    }

    @Override
    public MaterialFactor getMaterialFactor(MaterialType materialType, String unit) {
        Map<String, BigDecimal> units = materialFactors.get(materialType);
        if (units == null || !units.containsKey(unit)) {
            throw new BusinessException("Unsupported factor for material " + materialType + " and unit " + unit);
        }
        return new MaterialFactor(units.get(unit), sourceLabel);
    }

    @Override
    public EnergyFactor getEnergyFactor(EnergySource energySource) {
        BigDecimal factor = energyFactors.get(energySource);
        if (factor == null) {
            throw new BusinessException("Unsupported factor for energy source " + energySource);
        }
        return new EnergyFactor(factor, sourceLabel);
    }

    @Override
    public String getSourceLabel() {
        return sourceLabel;
    }

    private record FactorFile(
            @JsonProperty("sourceLabel") String sourceLabel,
            @JsonProperty("materials") Map<String, Map<String, BigDecimal>> materials,
            @JsonProperty("energy") Map<String, BigDecimal> energy) {
    }
}
