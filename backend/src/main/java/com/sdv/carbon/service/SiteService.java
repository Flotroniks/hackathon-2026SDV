package com.sdv.carbon.service;

import com.sdv.carbon.domain.model.Calculation;
import com.sdv.carbon.domain.model.Site;
import com.sdv.carbon.domain.model.SiteMaterial;
import com.sdv.carbon.domain.model.User;
import com.sdv.carbon.dto.common.PageResponse;
import com.sdv.carbon.dto.site.MaterialInput;
import com.sdv.carbon.dto.site.SiteListItemResponse;
import com.sdv.carbon.dto.site.SiteRequest;
import com.sdv.carbon.dto.site.SiteResponse;
import com.sdv.carbon.exception.BusinessException;
import com.sdv.carbon.exception.ResourceNotFoundException;
import com.sdv.carbon.mapper.SiteMapper;
import com.sdv.carbon.provider.EmissionFactorProvider;
import com.sdv.carbon.provider.MaterialFactor;
import com.sdv.carbon.repository.CalculationRepository;
import com.sdv.carbon.repository.SiteRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SiteService {

    private final SiteRepository siteRepository;
    private final CalculationRepository calculationRepository;
    private final EmissionFactorProvider emissionFactorProvider;
    private final UserService userService;
    private final SiteMapper siteMapper;

    @Transactional(readOnly = true)
    public PageResponse<SiteListItemResponse> list(int page, int size) {
        Page<Site> sites = siteRepository.findByArchivedFalseOrderByCreatedAtDesc(PageRequest.of(page, size));
        List<SiteListItemResponse> items = sites.getContent().stream()
                .map(site -> siteMapper.toListItem(site, calculationRepository.findTopBySiteIdOrderByVersionNoDesc(site.getId()).orElse(null)))
                .toList();
        return new PageResponse<>(items, page, size, sites.getTotalElements(), sites.getTotalPages());
    }

    @Transactional(readOnly = true)
    public SiteResponse get(UUID siteId) {
        Site site = getActiveSite(siteId);
        Calculation latest = calculationRepository.findTopBySiteIdOrderByVersionNoDesc(siteId).orElse(null);
        return siteMapper.toResponse(site, latest);
    }

    @Transactional
    public SiteResponse create(SiteRequest request, String currentUserEmail) {
        validateCodeUniqueness(request.code(), null);

        User user = userService.getRequiredByEmail(currentUserEmail);
        Site site = new Site();
        applyRequest(site, request, user);
        Site saved = siteRepository.save(site);
        return siteMapper.toResponse(saved, null);
    }

    @Transactional
    public SiteResponse update(UUID siteId, SiteRequest request) {
        Site site = getActiveSite(siteId);
        validateCodeUniqueness(request.code(), siteId);
        applyRequest(site, request, site.getCreatedBy());
        Site saved = siteRepository.save(site);
        Calculation latest = calculationRepository.findTopBySiteIdOrderByVersionNoDesc(siteId).orElse(null);
        return siteMapper.toResponse(saved, latest);
    }

    @Transactional
    public void archive(UUID siteId) {
        Site site = getActiveSite(siteId);
        site.setArchived(true);
        siteRepository.save(site);
    }

    @Transactional(readOnly = true)
    public Site getActiveSite(UUID siteId) {
        return siteRepository.findByIdAndArchivedFalse(siteId)
                .orElseThrow(() -> new ResourceNotFoundException("Site not found"));
    }

    private void validateCodeUniqueness(String code, UUID currentSiteId) {
        siteRepository.findByCodeIgnoreCase(code)
                .filter(existing -> currentSiteId == null || !existing.getId().equals(currentSiteId))
                .ifPresent(existing -> {
                    throw new BusinessException("Site code already exists");
                });
    }

    private void applyRequest(Site site, SiteRequest request, User createdBy) {
        site.setName(request.name());
        site.setCode(request.code().toUpperCase());
        site.setAddress(request.address());
        site.setCity(request.city());
        site.setCountry(request.country());
        site.setTotalAreaM2(request.totalAreaM2());
        site.setParkingSpaces(request.parkingSpaces());
        site.setAnnualEnergyConsumptionKwh(request.annualEnergyConsumptionKwh());
        site.setEnergySource(request.energySource());
        site.setEmployeeCount(request.employeeCount());
        site.setCreatedBy(createdBy);

        List<SiteMaterial> materials = new ArrayList<>();
        for (MaterialInput materialInput : request.materials()) {
            MaterialFactor factor = emissionFactorProvider.getMaterialFactor(materialInput.materialType(), materialInput.unit());
            SiteMaterial material = new SiteMaterial();
            material.setSite(site);
            material.setMaterialType(materialInput.materialType());
            material.setMaterialLabel(materialInput.materialLabel());
            material.setQuantity(materialInput.quantity());
            material.setUnit(materialInput.unit());
            material.setEmissionFactorKgCo2ePerUnit(factor.valueKgCo2ePerUnit());
            material.setFactorSource(factor.sourceLabel());
            materials.add(material);
        }

        site.getMaterials().clear();
        site.getMaterials().addAll(materials);
    }
}
