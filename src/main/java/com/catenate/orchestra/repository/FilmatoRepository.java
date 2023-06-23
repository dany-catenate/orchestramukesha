package com.catenate.orchestra.repository;

import com.catenate.orchestra.domain.Filmato;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Filmato entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FilmatoRepository extends JpaRepository<Filmato, Long> {}
