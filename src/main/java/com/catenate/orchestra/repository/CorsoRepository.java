package com.catenate.orchestra.repository;

import com.catenate.orchestra.domain.Corso;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Corso entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CorsoRepository extends JpaRepository<Corso, Long> {}
