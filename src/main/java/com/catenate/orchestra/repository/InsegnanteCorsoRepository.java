package com.catenate.orchestra.repository;

import com.catenate.orchestra.domain.InsegnanteCorso;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the InsegnanteCorso entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InsegnanteCorsoRepository extends JpaRepository<InsegnanteCorso, Long> {}
