package com.sdv.carbon.provider;

import com.sdv.carbon.domain.model.enums.EnergySource;
import com.sdv.carbon.domain.model.enums.MaterialType;

public interface EmissionFactorProvider {

    MaterialFactor getMaterialFactor(MaterialType materialType, String unit);

    EnergyFactor getEnergyFactor(EnergySource energySource);

    String getSourceLabel();
}
