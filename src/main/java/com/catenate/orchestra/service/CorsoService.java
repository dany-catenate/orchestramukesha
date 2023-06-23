package com.catenate.orchestra.service;

import com.catenate.orchestra.domain.Corso;
import com.catenate.orchestra.repository.CorsoRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Corso}.
 */
@Service
@Transactional
public class CorsoService {

    private final Logger log = LoggerFactory.getLogger(CorsoService.class);

    private final CorsoRepository corsoRepository;

    public CorsoService(CorsoRepository corsoRepository) {
        this.corsoRepository = corsoRepository;
    }

    /**
     * Save a corso.
     *
     * @param corso the entity to save.
     * @return the persisted entity.
     */
    public Corso save(Corso corso) {
        log.debug("Request to save Corso : {}", corso);
        return corsoRepository.save(corso);
    }

    /**
     * Update a corso.
     *
     * @param corso the entity to save.
     * @return the persisted entity.
     */
    public Corso update(Corso corso) {
        log.debug("Request to update Corso : {}", corso);
        return corsoRepository.save(corso);
    }

    /**
     * Partially update a corso.
     *
     * @param corso the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Corso> partialUpdate(Corso corso) {
        log.debug("Request to partially update Corso : {}", corso);

        return corsoRepository
            .findById(corso.getId())
            .map(existingCorso -> {
                if (corso.getAnno() != null) {
                    existingCorso.setAnno(corso.getAnno());
                }
                if (corso.getNome() != null) {
                    existingCorso.setNome(corso.getNome());
                }

                return existingCorso;
            })
            .map(corsoRepository::save);
    }

    /**
     * Get all the corsos.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Corso> findAll() {
        log.debug("Request to get all Corsos");
        return corsoRepository.findAll();
    }

    /**
     * Get one corso by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Corso> findOne(Long id) {
        log.debug("Request to get Corso : {}", id);
        return corsoRepository.findById(id);
    }

    /**
     * Delete the corso by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Corso : {}", id);
        corsoRepository.deleteById(id);
    }
}
