package com.sdv.carbon.provider;

import java.math.BigDecimal;

public record MaterialFactor(BigDecimal valueKgCo2ePerUnit, String sourceLabel) {
}
