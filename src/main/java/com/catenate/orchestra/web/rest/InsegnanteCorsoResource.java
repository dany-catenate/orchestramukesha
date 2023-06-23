package com.catenate.orchestra.web.rest;

import com.catenate.orchestra.domain.InsegnanteCorso;
import com.catenate.orchestra.repository.InsegnanteCorsoRepository;
import com.catenate.orchestra.service.InsegnanteCorsoService;
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
 * REST controller for managing {@link com.catenate.orchestra.domain.InsegnanteCorso}.
 */
@RestController
@RequestMapping("/api")
public class InsegnanteCorsoResource {

    private final Logger log = LoggerFactory.getLogger(InsegnanteCorsoResource.class);

    private static final String ENTITY_NAME = "insegnanteCorso";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InsegnanteCorsoService insegnanteCorsoService;

    private final InsegnanteCorsoRepository insegnanteCorsoRepository;

    public InsegnanteCorsoResource(InsegnanteCorsoService insegnanteCorsoService, InsegnanteCorsoRepository insegnanteCorsoRepository) {
        this.insegnanteCorsoService = insegnanteCorsoService;
        this.insegnanteCorsoRepository = insegnanteCorsoRepository;
    }

    /**
     * {@code POST  /insegnante-corsos} : Create a new insegnanteCorso.
     *
     * @param insegnanteCorso the insegnanteCorso to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new insegnanteCorso, or with status {@code 400 (Bad Request)} if the insegnanteCorso has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/insegnante-corsos")
    public ResponseEntity<InsegnanteCorso> createInsegnanteCorso(@RequestBody InsegnanteCorso insegnanteCorso) throws URISyntaxException {
        log.debug("REST request to save InsegnanteCorso : {}", insegnanteCorso);
        if (insegnanteCorso.getId() != null) {
            throw new BadRequestAlertException("A new insegnanteCorso cannot already have an ID", ENTITY_NAME, "idexists");
        }
        InsegnanteCorso result = insegnanteCorsoService.save(insegnanteCorso);
        return ResponseEntity
            .created(new URI("/api/insegnante-corsos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /insegnante-corsos/:id} : Updates an existing insegnanteCorso.
     *
     * @param id the id of the insegnanteCorso to save.
     * @param insegnanteCorso the insegnanteCorso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated insegnanteCorso,
     * or with status {@code 400 (Bad Request)} if the insegnanteCorso is not valid,
     * or with status {@code 500 (Internal Server Error)} if the insegnanteCorso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/insegnante-corsos/{id}")
    public ResponseEntity<InsegnanteCorso> updateInsegnanteCorso(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InsegnanteCorso insegnanteCorso
    ) throws URISyntaxException {
        log.debug("REST request to update InsegnanteCorso : {}, {}", id, insegnanteCorso);
        if (insegnanteCorso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, insegnanteCorso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!insegnanteCorsoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        InsegnanteCorso result = insegnanteCorsoService.update(insegnanteCorso);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, insegnanteCorso.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /insegnante-corsos/:id} : Partial updates given fields of an existing insegnanteCorso, field will ignore if it is null
     *
     * @param id the id of the insegnanteCorso to save.
     * @param insegnanteCorso the insegnanteCorso to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated insegnanteCorso,
     * or with status {@code 400 (Bad Request)} if the insegnanteCorso is not valid,
     * or with status {@code 404 (Not Found)} if the insegnanteCorso is not found,
     * or with status {@code 500 (Internal Server Error)} if the insegnanteCorso couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/insegnante-corsos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<InsegnanteCorso> partialUpdateInsegnanteCorso(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InsegnanteCorso insegnanteCorso
    ) throws URISyntaxException {
        log.debug("REST request to partial update InsegnanteCorso partially : {}, {}", id, insegnanteCorso);
        if (insegnanteCorso.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, insegnanteCorso.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!insegnanteCorsoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<InsegnanteCorso> result = insegnanteCorsoService.partialUpdate(insegnanteCorso);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, insegnanteCorso.getId().toString())
        );
    }

    /**
     * {@code GET  /insegnante-corsos} : get all the insegnanteCorsos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of insegnanteCorsos in body.
     */
    @GetMapping("/insegnante-corsos")
    public List<InsegnanteCorso> getAllInsegnanteCorsos() {
        log.debug("REST request to get all InsegnanteCorsos");
        return insegnanteCorsoService.findAll();
    }

    /**
     * {@code GET  /insegnante-corsos/:id} : get the "id" insegnanteCorso.
     *
     * @param id the id of the insegnanteCorso to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the insegnanteCorso, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/insegnante-corsos/{id}")
    public ResponseEntity<InsegnanteCorso> getInsegnanteCorso(@PathVariable Long id) {
        log.debug("REST request to get InsegnanteCorso : {}", id);
        Optional<InsegnanteCorso> insegnanteCorso = insegnanteCorsoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(insegnanteCorso);
    }

    /**
     * {@code DELETE  /insegnante-corsos/:id} : delete the "id" insegnanteCorso.
     *
     * @param id the id of the insegnanteCorso to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/insegnante-corsos/{id}")
    public ResponseEntity<Void> deleteInsegnanteCorso(@PathVariable Long id) {
        log.debug("REST request to delete InsegnanteCorso : {}", id);
        insegnanteCorsoService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
