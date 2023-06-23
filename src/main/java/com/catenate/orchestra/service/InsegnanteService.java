package com.catenate.orchestra.service;

import com.catenate.orchestra.domain.Insegnante;
import com.catenate.orchestra.repository.InsegnanteRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Insegnante}.
 */
@Service
@Transactional
public class InsegnanteService {

    private final Logger log = LoggerFactory.getLogger(InsegnanteService.class);

    private final InsegnanteRepository insegnanteRepository;

    public InsegnanteService(InsegnanteRepository insegnanteRepository) {
        this.insegnanteRepository = insegnanteRepository;
    }

    /**
     * Save a insegnante.
     *
     * @param insegnante the entity to save.
     * @return the persisted entity.
     */
    public Insegnante save(Insegnante insegnante) {
        log.debug("Request to save Insegnante : {}", insegnante);
        return insegnanteRepository.save(insegnante);
    }

    /**
     * Update a insegnante.
     *
     * @param insegnante the entity to save.
     * @return the persisted entity.
     */
    public Insegnante update(Insegnante insegnante) {
        log.debug("Request to update Insegnante : {}", insegnante);
        return insegnanteRepository.save(insegnante);
    }

    /**
     * Partially update a insegnante.
     *
     * @param insegnante the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Insegnante> partialUpdate(Insegnante insegnante) {
        log.debug("Request to partially update Insegnante : {}", insegnante);

        return insegnanteRepository
            .findById(insegnante.getId())
            .map(existingInsegnante -> {
                if (insegnante.getNome() != null) {
                    existingInsegnante.setNome(insegnante.getNome());
                }
                if (insegnante.getCognome() != null) {
                    existingInsegnante.setCognome(insegnante.getCognome());
                }

                return existingInsegnante;
            })
            .map(insegnanteRepository::save);
    }

    /**
     * Get all the insegnantes.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Insegnante> findAll() {
        log.debug("Request to get all Insegnantes");
        return insegnanteRepository.findAll();
    }

    /**
     * Get one insegnante by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Insegnante> findOne(Long id) {
        log.debug("Request to get Insegnante : {}", id);
        return insegnanteRepository.findById(id);
    }

    /**
     * Delete the insegnante by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Insegnante : {}", id);
        insegnanteRepository.deleteById(id);
    }
}
