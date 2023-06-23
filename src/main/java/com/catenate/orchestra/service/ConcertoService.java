package com.catenate.orchestra.service;

import com.catenate.orchestra.domain.Concerto;
import com.catenate.orchestra.repository.ConcertoRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Concerto}.
 */
@Service
@Transactional
public class ConcertoService {

    private final Logger log = LoggerFactory.getLogger(ConcertoService.class);

    private final ConcertoRepository concertoRepository;

    public ConcertoService(ConcertoRepository concertoRepository) {
        this.concertoRepository = concertoRepository;
    }

    /**
     * Save a concerto.
     *
     * @param concerto the entity to save.
     * @return the persisted entity.
     */
    public Concerto save(Concerto concerto) {
        log.debug("Request to save Concerto : {}", concerto);
        return concertoRepository.save(concerto);
    }

    /**
     * Update a concerto.
     *
     * @param concerto the entity to save.
     * @return the persisted entity.
     */
    public Concerto update(Concerto concerto) {
        log.debug("Request to update Concerto : {}", concerto);
        return concertoRepository.save(concerto);
    }

    /**
     * Partially update a concerto.
     *
     * @param concerto the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Concerto> partialUpdate(Concerto concerto) {
        log.debug("Request to partially update Concerto : {}", concerto);

        return concertoRepository
            .findById(concerto.getId())
            .map(existingConcerto -> {
                if (concerto.getData() != null) {
                    existingConcerto.setData(concerto.getData());
                }
                if (concerto.getNome() != null) {
                    existingConcerto.setNome(concerto.getNome());
                }

                return existingConcerto;
            })
            .map(concertoRepository::save);
    }

    /**
     * Get all the concertos.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Concerto> findAll() {
        log.debug("Request to get all Concertos");
        return concertoRepository.findAll();
    }

    /**
     * Get one concerto by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Concerto> findOne(Long id) {
        log.debug("Request to get Concerto : {}", id);
        return concertoRepository.findById(id);
    }

    /**
     * Delete the concerto by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Concerto : {}", id);
        concertoRepository.deleteById(id);
    }
}
