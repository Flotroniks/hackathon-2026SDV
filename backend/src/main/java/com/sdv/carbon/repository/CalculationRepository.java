package com.sdv.carbon.repository;

import com.sdv.carbon.domain.model.Calculation;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalculationRepository extends JpaRepository<Calculation, UUID> {

    List<Calculation> findBySiteIdOrderByVersionNoDesc(UUID siteId);

    Optional<Calculation> findTopBySiteIdOrderByVersionNoDesc(UUID siteId);

    @Override
    @EntityGraph(attributePaths = {"site", "materialSnapshots"})
    Optional<Calculation> findById(UUID id);

    List<Calculation> findByCreatedAtBetweenOrderByCreatedAtAsc(OffsetDateTime from, OffsetDateTime to);

    List<Calculation> findBySiteIdAndCreatedAtBetweenOrderByCreatedAtAsc(UUID siteId, OffsetDateTime from, OffsetDateTime to);
}
