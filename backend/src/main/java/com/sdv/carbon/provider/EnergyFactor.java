package com.sdv.carbon.provider;

import java.math.BigDecimal;

public record EnergyFactor(BigDecimal valueKgCo2ePerKwh, String sourceLabel) {
}
