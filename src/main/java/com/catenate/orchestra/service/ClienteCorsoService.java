package com.catenate.orchestra.service;

import com.catenate.orchestra.domain.ClienteCorso;
import com.catenate.orchestra.repository.ClienteCorsoRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ClienteCorso}.
 */
@Service
@Transactional
public class ClienteCorsoService {

    private final Logger log = LoggerFactory.getLogger(ClienteCorsoService.class);

    private final ClienteCorsoRepository clienteCorsoRepository;

    public ClienteCorsoService(ClienteCorsoRepository clienteCorsoRepository) {
        this.clienteCorsoRepository = clienteCorsoRepository;
    }

    /**
     * Save a clienteCorso.
     *
     * @param clienteCorso the entity to save.
     * @return the persisted entity.
     */
    public ClienteCorso save(ClienteCorso clienteCorso) {
        log.debug("Request to save ClienteCorso : {}", clienteCorso);
        return clienteCorsoRepository.save(clienteCorso);
    }

    /**
     * Update a clienteCorso.
     *
     * @param clienteCorso the entity to save.
     * @return the persisted entity.
     */
    public ClienteCorso update(ClienteCorso clienteCorso) {
        log.debug("Request to update ClienteCorso : {}", clienteCorso);
        return clienteCorsoRepository.save(clienteCorso);
    }

    /**
     * Partially update a clienteCorso.
     *
     * @param clienteCorso the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ClienteCorso> partialUpdate(ClienteCorso clienteCorso) {
        log.debug("Request to partially update ClienteCorso : {}", clienteCorso);

        return clienteCorsoRepository
            .findById(clienteCorso.getId())
            .map(existingClienteCorso -> {
                if (clienteCorso.getId_cliente() != null) {
                    existingClienteCorso.setId_cliente(clienteCorso.getId_cliente());
                }
                if (clienteCorso.getId_corso() != null) {
                    existingClienteCorso.setId_corso(clienteCorso.getId_corso());
                }
                if (clienteCorso.getMese() != null) {
                    existingClienteCorso.setMese(clienteCorso.getMese());
                }
                if (clienteCorso.getPagato() != null) {
                    existingClienteCorso.setPagato(clienteCorso.getPagato());
                }

                return existingClienteCorso;
            })
            .map(clienteCorsoRepository::save);
    }

    /**
     * Get all the clienteCorsos.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ClienteCorso> findAll() {
        log.debug("Request to get all ClienteCorsos");
        return clienteCorsoRepository.findAll();
    }

    /**
     * Get one clienteCorso by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ClienteCorso> findOne(Long id) {
        log.debug("Request to get ClienteCorso : {}", id);
        return clienteCorsoRepository.findById(id);
    }

    /**
     * Delete the clienteCorso by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete ClienteCorso : {}", id);
        clienteCorsoRepository.deleteById(id);
    }
}
