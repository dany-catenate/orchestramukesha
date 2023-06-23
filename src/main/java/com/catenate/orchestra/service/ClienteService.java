package com.catenate.orchestra.service;

import com.catenate.orchestra.domain.Cliente;
import com.catenate.orchestra.repository.ClienteRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Cliente}.
 */
@Service
@Transactional
public class ClienteService {

    private final Logger log = LoggerFactory.getLogger(ClienteService.class);

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    /**
     * Save a cliente.
     *
     * @param cliente the entity to save.
     * @return the persisted entity.
     */
    public Cliente save(Cliente cliente) {
        log.debug("Request to save Cliente : {}", cliente);
        return clienteRepository.save(cliente);
    }

    /**
     * Update a cliente.
     *
     * @param cliente the entity to save.
     * @return the persisted entity.
     */
    public Cliente update(Cliente cliente) {
        log.debug("Request to update Cliente : {}", cliente);
        return clienteRepository.save(cliente);
    }

    /**
     * Partially update a cliente.
     *
     * @param cliente the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Cliente> partialUpdate(Cliente cliente) {
        log.debug("Request to partially update Cliente : {}", cliente);

        return clienteRepository
            .findById(cliente.getId())
            .map(existingCliente -> {
                if (cliente.getNome() != null) {
                    existingCliente.setNome(cliente.getNome());
                }
                if (cliente.getCognome() != null) {
                    existingCliente.setCognome(cliente.getCognome());
                }

                return existingCliente;
            })
            .map(clienteRepository::save);
    }

    /**
     * Get all the clientes.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Cliente> findAll() {
        log.debug("Request to get all Clientes");
        return clienteRepository.findAll();
    }

    /**
     * Get one cliente by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> findOne(Long id) {
        log.debug("Request to get Cliente : {}", id);
        return clienteRepository.findById(id);
    }

    /**
     * Delete the cliente by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Cliente : {}", id);
        clienteRepository.deleteById(id);
    }
}
