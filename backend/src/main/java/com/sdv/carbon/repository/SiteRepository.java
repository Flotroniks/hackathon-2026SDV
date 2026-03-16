package com.sdv.carbon.repository;

import com.sdv.carbon.domain.model.Site;
import java.util.Optional;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteRepository extends JpaRepository<Site, UUID> {

    Page<Site> findByArchivedFalseOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = {"materials", "createdBy"})
    Optional<Site> findByIdAndArchivedFalse(UUID id);

    boolean existsByCodeIgnoreCase(String code);

    Optional<Site> findByCodeIgnoreCase(String code);

    long countByArchivedFalse();

    List<Site> findByArchivedFalseOrderByNameAsc();
}
