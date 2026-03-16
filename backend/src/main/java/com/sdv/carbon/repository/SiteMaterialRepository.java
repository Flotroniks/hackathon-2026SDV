package com.sdv.carbon.repository;

import com.sdv.carbon.domain.model.SiteMaterial;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteMaterialRepository extends JpaRepository<SiteMaterial, UUID> {

    List<SiteMaterial> findBySiteId(UUID siteId);
}
