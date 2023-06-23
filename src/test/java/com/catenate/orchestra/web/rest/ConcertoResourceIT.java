package com.catenate.orchestra.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.catenate.orchestra.IntegrationTest;
import com.catenate.orchestra.domain.Concerto;
import com.catenate.orchestra.repository.ConcertoRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ConcertoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConcertoResourceIT {

    private static final LocalDate DEFAULT_DATA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/concertos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConcertoRepository concertoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConcertoMockMvc;

    private Concerto concerto;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Concerto createEntity(EntityManager em) {
        Concerto concerto = new Concerto().data(DEFAULT_DATA).nome(DEFAULT_NOME);
        return concerto;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Concerto createUpdatedEntity(EntityManager em) {
        Concerto concerto = new Concerto().data(UPDATED_DATA).nome(UPDATED_NOME);
        return concerto;
    }

    @BeforeEach
    public void initTest() {
        concerto = createEntity(em);
    }

    @Test
    @Transactional
    void createConcerto() throws Exception {
        int databaseSizeBeforeCreate = concertoRepository.findAll().size();
        // Create the Concerto
        restConcertoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(concerto)))
            .andExpect(status().isCreated());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeCreate + 1);
        Concerto testConcerto = concertoList.get(concertoList.size() - 1);
        assertThat(testConcerto.getData()).isEqualTo(DEFAULT_DATA);
        assertThat(testConcerto.getNome()).isEqualTo(DEFAULT_NOME);
    }

    @Test
    @Transactional
    void createConcertoWithExistingId() throws Exception {
        // Create the Concerto with an existing ID
        concerto.setId(1L);

        int databaseSizeBeforeCreate = concertoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConcertoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(concerto)))
            .andExpect(status().isBadRequest());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConcertos() throws Exception {
        // Initialize the database
        concertoRepository.saveAndFlush(concerto);

        // Get all the concertoList
        restConcertoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(concerto.getId().intValue())))
            .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    @Transactional
    void getConcerto() throws Exception {
        // Initialize the database
        concertoRepository.saveAndFlush(concerto);

        // Get the concerto
        restConcertoMockMvc
            .perform(get(ENTITY_API_URL_ID, concerto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(concerto.getId().intValue()))
            .andExpect(jsonPath("$.data").value(DEFAULT_DATA.toString()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME));
    }

    @Test
    @Transactional
    void getNonExistingConcerto() throws Exception {
        // Get the concerto
        restConcertoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingConcerto() throws Exception {
        // Initialize the database
        concertoRepository.saveAndFlush(concerto);

        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();

        // Update the concerto
        Concerto updatedConcerto = concertoRepository.findById(concerto.getId()).get();
        // Disconnect from session so that the updates on updatedConcerto are not directly saved in db
        em.detach(updatedConcerto);
        updatedConcerto.data(UPDATED_DATA).nome(UPDATED_NOME);

        restConcertoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConcerto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConcerto))
            )
            .andExpect(status().isOk());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
        Concerto testConcerto = concertoList.get(concertoList.size() - 1);
        assertThat(testConcerto.getData()).isEqualTo(UPDATED_DATA);
        assertThat(testConcerto.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void putNonExistingConcerto() throws Exception {
        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();
        concerto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConcertoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, concerto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(concerto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConcerto() throws Exception {
        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();
        concerto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcertoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(concerto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConcerto() throws Exception {
        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();
        concerto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcertoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(concerto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConcertoWithPatch() throws Exception {
        // Initialize the database
        concertoRepository.saveAndFlush(concerto);

        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();

        // Update the concerto using partial update
        Concerto partialUpdatedConcerto = new Concerto();
        partialUpdatedConcerto.setId(concerto.getId());

        partialUpdatedConcerto.nome(UPDATED_NOME);

        restConcertoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConcerto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConcerto))
            )
            .andExpect(status().isOk());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
        Concerto testConcerto = concertoList.get(concertoList.size() - 1);
        assertThat(testConcerto.getData()).isEqualTo(DEFAULT_DATA);
        assertThat(testConcerto.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void fullUpdateConcertoWithPatch() throws Exception {
        // Initialize the database
        concertoRepository.saveAndFlush(concerto);

        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();

        // Update the concerto using partial update
        Concerto partialUpdatedConcerto = new Concerto();
        partialUpdatedConcerto.setId(concerto.getId());

        partialUpdatedConcerto.data(UPDATED_DATA).nome(UPDATED_NOME);

        restConcertoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConcerto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConcerto))
            )
            .andExpect(status().isOk());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
        Concerto testConcerto = concertoList.get(concertoList.size() - 1);
        assertThat(testConcerto.getData()).isEqualTo(UPDATED_DATA);
        assertThat(testConcerto.getNome()).isEqualTo(UPDATED_NOME);
    }

    @Test
    @Transactional
    void patchNonExistingConcerto() throws Exception {
        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();
        concerto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConcertoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, concerto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(concerto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConcerto() throws Exception {
        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();
        concerto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcertoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(concerto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConcerto() throws Exception {
        int databaseSizeBeforeUpdate = concertoRepository.findAll().size();
        concerto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConcertoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(concerto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Concerto in the database
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConcerto() throws Exception {
        // Initialize the database
        concertoRepository.saveAndFlush(concerto);

        int databaseSizeBeforeDelete = concertoRepository.findAll().size();

        // Delete the concerto
        restConcertoMockMvc
            .perform(delete(ENTITY_API_URL_ID, concerto.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Concerto> concertoList = concertoRepository.findAll();
        assertThat(concertoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
