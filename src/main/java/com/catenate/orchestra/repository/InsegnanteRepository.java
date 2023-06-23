package com.catenate.orchestra.repository;

import com.catenate.orchestra.domain.Insegnante;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Insegnante entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InsegnanteRepository extends JpaRepository<Insegnante, Long> {}
