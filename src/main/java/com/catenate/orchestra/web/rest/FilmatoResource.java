package com.catenate.orchestra.web.rest;

import com.catenate.orchestra.domain.Filmato;
import com.catenate.orchestra.repository.FilmatoRepository;
import com.catenate.orchestra.service.FilmatoService;
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
 * REST controller for managing {@link com.catenate.orchestra.domain.Filmato}.
 */
@RestController
@RequestMapping("/api")
public class FilmatoResource {

    private final Logger log = LoggerFactory.getLogger(FilmatoResource.class);

    private static final String ENTITY_NAME = "filmato";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FilmatoService filmatoService;

    private final FilmatoRepository filmatoRepository;

    public FilmatoResource(FilmatoService filmatoService, FilmatoRepository filmatoRepository) {
        this.filmatoService = filmatoService;
        this.filmatoRepository = filmatoRepository;
    }

    /**
     * {@code POST  /filmatoes} : Create a new filmato.
     *
     * @param filmato the filmato to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new filmato, or with status {@code 400 (Bad Request)} if the filmato has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/filmatoes")
    public ResponseEntity<Filmato> createFilmato(@RequestBody Filmato filmato) throws URISyntaxException {
        log.debug("REST request to save Filmato : {}", filmato);
        if (filmato.getId() != null) {
            throw new BadRequestAlertException("A new filmato cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Filmato result = filmatoService.save(filmato);
        return ResponseEntity
            .created(new URI("/api/filmatoes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /filmatoes/:id} : Updates an existing filmato.
     *
     * @param id the id of the filmato to save.
     * @param filmato the filmato to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated filmato,
     * or with status {@code 400 (Bad Request)} if the filmato is not valid,
     * or with status {@code 500 (Internal Server Error)} if the filmato couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/filmatoes/{id}")
    public ResponseEntity<Filmato> updateFilmato(@PathVariable(value = "id", required = false) final Long id, @RequestBody Filmato filmato)
        throws URISyntaxException {
        log.debug("REST request to update Filmato : {}, {}", id, filmato);
        if (filmato.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, filmato.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!filmatoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Filmato result = filmatoService.update(filmato);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, filmato.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /filmatoes/:id} : Partial updates given fields of an existing filmato, field will ignore if it is null
     *
     * @param id the id of the filmato to save.
     * @param filmato the filmato to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated filmato,
     * or with status {@code 400 (Bad Request)} if the filmato is not valid,
     * or with status {@code 404 (Not Found)} if the filmato is not found,
     * or with status {@code 500 (Internal Server Error)} if the filmato couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/filmatoes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Filmato> partialUpdateFilmato(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Filmato filmato
    ) throws URISyntaxException {
        log.debug("REST request to partial update Filmato partially : {}, {}", id, filmato);
        if (filmato.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, filmato.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!filmatoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Filmato> result = filmatoService.partialUpdate(filmato);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, filmato.getId().toString())
        );
    }

    /**
     * {@code GET  /filmatoes} : get all the filmatoes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of filmatoes in body.
     */
    @GetMapping("/filmatoes")
    public List<Filmato> getAllFilmatoes() {
        log.debug("REST request to get all Filmatoes");
        return filmatoService.findAll();
    }

    /**
     * {@code GET  /filmatoes/:id} : get the "id" filmato.
     *
     * @param id the id of the filmato to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the filmato, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/filmatoes/{id}")
    public ResponseEntity<Filmato> getFilmato(@PathVariable Long id) {
        log.debug("REST request to get Filmato : {}", id);
        Optional<Filmato> filmato = filmatoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(filmato);
    }

    /**
     * {@code DELETE  /filmatoes/:id} : delete the "id" filmato.
     *
     * @param id the id of the filmato to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/filmatoes/{id}")
    public ResponseEntity<Void> deleteFilmato(@PathVariable Long id) {
        log.debug("REST request to delete Filmato : {}", id);
        filmatoService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
