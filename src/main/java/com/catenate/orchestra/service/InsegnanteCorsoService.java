package com.catenate.orchestra.service;

import com.catenate.orchestra.domain.InsegnanteCorso;
import com.catenate.orchestra.repository.InsegnanteCorsoRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link InsegnanteCorso}.
 */
@Service
@Transactional
public class InsegnanteCorsoService {

    private final Logger log = LoggerFactory.getLogger(InsegnanteCorsoService.class);

    private final InsegnanteCorsoRepository insegnanteCorsoRepository;

    public InsegnanteCorsoService(InsegnanteCorsoRepository insegnanteCorsoRepository) {
        this.insegnanteCorsoRepository = insegnanteCorsoRepository;
    }

    /**
     * Save a insegnanteCorso.
     *
     * @param insegnanteCorso the entity to save.
     * @return the persisted entity.
     */
    public InsegnanteCorso save(InsegnanteCorso insegnanteCorso) {
        log.debug("Request to save InsegnanteCorso : {}", insegnanteCorso);
        return insegnanteCorsoRepository.save(insegnanteCorso);
    }

    /**
     * Update a insegnanteCorso.
     *
     * @param insegnanteCorso the entity to save.
     * @return the persisted entity.
     */
    public InsegnanteCorso update(InsegnanteCorso insegnanteCorso) {
        log.debug("Request to update InsegnanteCorso : {}", insegnanteCorso);
        return insegnanteCorsoRepository.save(insegnanteCorso);
    }

    /**
     * Partially update a insegnanteCorso.
     *
     * @param insegnanteCorso the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<InsegnanteCorso> partialUpdate(InsegnanteCorso insegnanteCorso) {
        log.debug("Request to partially update InsegnanteCorso : {}", insegnanteCorso);

        return insegnanteCorsoRepository
            .findById(insegnanteCorso.getId())
            .map(existingInsegnanteCorso -> {
                if (insegnanteCorso.getId_insegnante() != null) {
                    existingInsegnanteCorso.setId_insegnante(insegnanteCorso.getId_insegnante());
                }
                if (insegnanteCorso.getId_corso() != null) {
                    existingInsegnanteCorso.setId_corso(insegnanteCorso.getId_corso());
                }
                if (insegnanteCorso.getMese() != null) {
                    existingInsegnanteCorso.setMese(insegnanteCorso.getMese());
                }

                return existingInsegnanteCorso;
            })
            .map(insegnanteCorsoRepository::save);
    }

    /**
     * Get all the insegnanteCorsos.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<InsegnanteCorso> findAll() {
        log.debug("Request to get all InsegnanteCorsos");
        return insegnanteCorsoRepository.findAll();
    }

    /**
     * Get one insegnanteCorso by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<InsegnanteCorso> findOne(Long id) {
        log.debug("Request to get InsegnanteCorso : {}", id);
        return insegnanteCorsoRepository.findById(id);
    }

    /**
     * Delete the insegnanteCorso by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete InsegnanteCorso : {}", id);
        insegnanteCorsoRepository.deleteById(id);
    }
}
