package com.catenate.orchestra.repository;

import com.catenate.orchestra.domain.ClienteCorso;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ClienteCorso entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClienteCorsoRepository extends JpaRepository<ClienteCorso, Long> {}
