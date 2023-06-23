package com.catenate.orchestra.web.rest;

import com.catenate.orchestra.domain.ClienteCorso;
import com.catenate.orchestra.repository.ClienteCorsoRepository;
import com.catenate.orchestra.service.ClienteCorsoService;
import com.catenate.orchestra.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.catenate.orchestra.domain.ClienteCorso}.
 */
@RestController
@RequestMapping("/api")
public class ClienteCorsoResource {

    private final Logger log = LoggerFactory.getLogger(ClienteCorsoResource.class);

    private static final String ENTITY_NAME = "clienteCorso";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClienteCorsoService clienteCorsoService;

    private final ClienteCorsoRepository clienteCorsoRepository;

    public ClienteCorsoResource(ClienteCorsoService clienteCorsoService, ClienteCorsoRepository clienteCorsoRepository) {
        this.clienteCorsoService = clienteCorsoService;
        this.clienteCorsoRepository = clienteCorsoRepository;
    }

    /**
     * {@code POST  /cliente-corsos} : Create a new clienteCorso.
     *
     * @param clienteCorso the clienteCorso to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new clienteCorso, or with status {@code 400 (Bad Request)} if the clienteCorso has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/cliente-corsos")
    public ResponseEntity<ClienteCorso> createClienteCorso(@RequestBody ClienteCorso clienteCorso) throws URISyntaxException {
        log.debug("REST request to save ClienteCorso : {}", clienteCorso);
        if (clienteCorso.getId() != null) {
            throw new BadRequestAlertException("A new clienteCorso cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ClienteCorso result = clienteCorsoService.save(clienteCorso);
        return ResponseEntity
            .created(new URI("/api/cliente-corsos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /cliente-corsos/:id} : Updates an existing clienteCorso.
     *
     * @param id the id of the clienteCorso to save.
     * @param clienteCorso the clienteCorso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clienteCorso,
     * or with status {@code 400 (Bad Request)} if the clienteCorso is not valid,
     * or with status {@code 500 (Internal Server Error)} if the clienteCorso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cliente-corsos/{id}")
    public ResponseEntity<ClienteCorso> updateClienteCorso(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClienteCorso clienteCorso
    ) throws URISyntaxException {
        log.debug("REST request to update ClienteCorso : {}, {}", id, clienteCorso);
        if (clienteCorso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clienteCorso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clienteCorsoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ClienteCorso result = clienteCorsoService.update(clienteCorso);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, clienteCorso.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /cliente-corsos/:id} : Partial updates given fields of an existing clienteCorso, field will ignore if it is null
     *
     * @param id the id of the clienteCorso to save.
     * @param clienteCorso the clienteCorso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated clienteCorso,
     * or with status {@code 400 (Bad Request)} if the clienteCorso is not valid,
     * or with status {@code 404 (Not Found)} if the clienteCorso is not found,
     * or with status {@code 500 (Internal Server Error)} if the clienteCorso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/cliente-corsos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ClienteCorso> partialUpdateClienteCorso(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ClienteCorso clienteCorso
    ) throws URISyntaxException {
        log.debug("REST request to partial update ClienteCorso partially : {}, {}", id, clienteCorso);
        if (clienteCorso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, clienteCorso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clienteCorsoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ClienteCorso> result = clienteCorsoService.partialUpdate(clienteCorso);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, clienteCorso.getId().toString())
        );
    }

    /**
     * {@code GET  /cliente-corsos} : get all the clienteCorsos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of clienteCorsos in body.
     */
    @GetMapping("/cliente-corsos")
    public List<ClienteCorso> getAllClienteCorsos() {
        log.debug("REST request to get all ClienteCorsos");
        return clienteCorsoService.findAll();
    }

    /**
     * {@code GET  /cliente-corsos/:id} : get the "id" clienteCorso.
     *
     * @param id the id of the clienteCorso to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the clienteCorso, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/cliente-corsos/{id}")
    public ResponseEntity<ClienteCorso> getClienteCorso(@PathVariable Long id) {
        log.debug("REST request to get ClienteCorso : {}", id);
        Optional<ClienteCorso> clienteCorso = clienteCorsoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(clienteCorso);
    }

    /**
     * {@code DELETE  /cliente-corsos/:id} : delete the "id" clienteCorso.
     *
     * @param id the id of the clienteCorso to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/cliente-corsos/{id}")
    public ResponseEntity<Void> deleteClienteCorso(@PathVariable Long id) {
        log.debug("REST request to delete ClienteCorso : {}", id);
        clienteCorsoService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
