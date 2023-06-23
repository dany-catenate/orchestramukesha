package com.catenate.orchestra.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.catenate.orchestra.IntegrationTest;
import com.catenate.orchestra.domain.InsegnanteCorso;
import com.catenate.orchestra.repository.InsegnanteCorsoRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link InsegnanteCorsoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InsegnanteCorsoResourceIT {

    private static final Long DEFAULT_ID_INSEGNANTE = 1L;
    private static final Long UPDATED_ID_INSEGNANTE = 2L;

    private static final Long DEFAULT_ID_CORSO = 1L;
    private static final Long UPDATED_ID_CORSO = 2L;

    private static final Integer DEFAULT_MESE = 1;
    private static final Integer UPDATED_MESE = 2;

    private static final String ENTITY_API_URL = "/api/insegnante-corsos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InsegnanteCorsoRepository insegnanteCorsoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInsegnanteCorsoMockMvc;

    private InsegnanteCorso insegnanteCorso;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InsegnanteCorso createEntity(EntityManager em) {
        InsegnanteCorso insegnanteCorso = new InsegnanteCorso()
            .id_insegnante(DEFAULT_ID_INSEGNANTE)
            .id_corso(DEFAULT_ID_CORSO)
            .mese(DEFAULT_MESE);
        return insegnanteCorso;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InsegnanteCorso createUpdatedEntity(EntityManager em) {
        InsegnanteCorso insegnanteCorso = new InsegnanteCorso()
            .id_insegnante(UPDATED_ID_INSEGNANTE)
            .id_corso(UPDATED_ID_CORSO)
            .mese(UPDATED_MESE);
        return insegnanteCorso;
    }

    @BeforeEach
    public void initTest() {
        insegnanteCorso = createEntity(em);
    }

    @Test
    @Transactional
    void createInsegnanteCorso() throws Exception {
        int databaseSizeBeforeCreate = insegnanteCorsoRepository.findAll().size();
        // Create the InsegnanteCorso
        restInsegnanteCorsoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(insegnanteCorso))
            )
            .andExpect(status().isCreated());

        // Validate the InsegnanteCorso in the database
        List<InsegnanteCorso> insegnanteCorsoList = insegnanteCorsoRepository.findAll();
        assertThat(insegnanteCorsoList).hasSize(databaseSizeBeforeCreate + 1);
        InsegnanteCorso testInsegnanteCorso = insegnanteCorsoList.get(insegnanteCorsoList.size() - 1);
        assertThat(testInsegnanteCorso.getId_insegnante()).isEqualTo(DEFAULT_ID_INSEGNANTE);
        assertThat(testInsegnanteCorso.getId_corso()).isEqualTo(DEFAULT_ID_CORSO);
        assertThat(testInsegnanteCorso.getMese()).isEqualTo(DEFAULT_MESE);
    }

    @Test
    @Transactional
    void createInsegnanteCorsoWithExistingId() throws Exception {
        // Create the InsegnanteCorso with an existing ID
        insegnanteCorso.setId(1L);

        int databaseSizeBeforeCreate = insegnanteCorsoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInsegnanteCorsoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(insegnanteCorso))
            )
            .andExpect(status().isBadRequest());

        // Validate the InsegnanteCorso in the database
        List<InsegnanteCorso> insegnanteCorsoList = insegnanteCorsoRepository.findAll();
        assertThat(insegnanteCorsoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInsegnanteCorsos() throws Exception {
        // Initialize the database
        insegnanteCorsoRepository.saveAndFlush(insegnanteCorso);

        // Get all the insegnanteCorsoList
        restInsegnanteCorsoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(insegnanteCorso.getId().intValue())))
            .andExpect(jsonPath("$.[*].id_insegnante").value(hasItem(DEFAULT_ID_INSEGNANTE.intValue())))
            .andExpect(jsonPath("$.[*].id_corso").value(hasItem(DEFAULT_ID_CORSO.intValue())))
            .andExpect(jsonPath("$.[*].mese").value(hasItem(DEFAULT_MESE)));
    }

    @Test
    @Transactional
    void getInsegnanteCorso() throws Exception {
        // Initialize the database
        insegnanteCorsoRepository.saveAndFlush(insegnanteCorso);

        // Get the insegnanteCorso
        restInsegnanteCorsoMockMvc
            .perform(get(ENTITY_API_URL_ID, insegnanteCorso.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(insegnanteCorso.getId().intValue()))
            .andExpect(jsonPath("$.id_insegnante").value(DEFAULT_ID_INSEGNANTE.intValue()))
            .andExpect(jsonPath("$.id_corso").value(DEFAULT_ID_CORSO.intValue()))
            .andExpect(jsonPath("$.mese").value(DEFAULT_MESE));
    }

    @Test
    @Transactional
    void getNonExistingInsegnanteCorso() throws Exception {
        // Get the insegnanteCorso
        restInsegnanteCorsoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInsegnanteCorso() throws Exception {
        // Initialize the database
        insegnanteCorsoRepository.saveAndFlush(insegnanteCorso);

        int databaseSizeBeforeUpdate = insegnanteCorsoRepository.findAll().size();

        // Update the insegnanteCorso
        InsegnanteCorso updatedInsegnanteCorso = insegnanteCorsoRepository.findById(insegnanteCorso.getId()).get();
        // Disconnect from session so that the updates on updatedInsegnanteCorso are not directly saved in db
        em.detach(updatedInsegnanteCorso);
        updatedInsegnanteCorso.id_insegnante(UPDATED_ID_INSEGNANTE).id_corso(UPDATED_ID_CORSO).mese(UPDATED_MESE);

        restInsegnanteCorsoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInsegnanteCorso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInsegnanteCorso))
            )
            .andExpect(status().isOk());

        // Validate the InsegnanteCorso in the database
        List<InsegnanteCorso> insegnanteCorsoList = insegnanteCorsoRepository.findAll();
        assertThat(insegnanteCorsoList).hasSize(databaseSizeBeforeUpdate);
        InsegnanteCorso testInsegnanteCorso = insegnanteCorsoList.get(insegnanteCorsoList.size() - 1);
        assertThat(testInsegnanteCorso.getId_insegnante()).isEqualTo(UPDATED_ID_INSEGNANTE);
        assertThat(testInsegnanteCorso.getId_corso()).isEqualTo(UPDATED_ID_CORSO);
        assertThat(testInsegnanteCorso.getMese()).isEqualTo(UPDATED_MESE);
    }

    @Test
    @Transactional
    void putNonExistingInsegnanteCorso() throws Exception {
        int databaseSizeBeforeUpdate = insegnanteCorsoRepository.findAll().size();
        insegnanteCorso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInsegnanteCorsoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, insegnanteCorso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(insegnanteCorso))
            )
            .andExpect(status().isBadRequest());

        // Validate the InsegnanteCorso in the database
        List<InsegnanteCorso> insegnanteCorsoList = insegnanteCorsoRepository.findAll();
        assertThat(insegnanteCorsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInsegnanteCorso() throws Exception {
        int databaseSizeBeforeUpdate = insegnanteCorsoRepository.findAll().size();
        insegnanteCorso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInsegnanteCorsoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(insegnanteCorso))
            )
            .andExpect(status().isBadRequest());

        // Validate the InsegnanteCorso in the database
        List<InsegnanteCorso> insegnanteCorsoList = insegnanteCorsoRepository.findAll();
        assertThat(insegnanteCorsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInsegnanteCorso() throws Exception {
        int databaseSizeBeforeUpdate = insegnanteCorsoRepository.findAll().size();
        insegnanteCorso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInsegnanteCorsoMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(insegnanteCorso))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InsegnanteCorso in the database
        List<InsegnanteCorso> insegnanteCorsoList = insegnanteCorsoRepository.findAll();
        assertThat(insegnanteCorsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInsegnanteCorsoWithPatch() throws Exception {
        // Initialize the database
        insegnanteCorsoRepository.saveAndFlush(insegnanteCorso);

        int databaseSizeBeforeUpdate = insegnanteCorsoRepository.findAll().size();

        // Update the insegnanteCorso using partial update
        InsegnanteCorso partialUpdatedInsegnanteCorso = new InsegnanteCorso();
        partialUpdatedInsegnanteCorso.setId(insegnanteCorso.getId());

        partialUpdatedInsegnanteCorso.id_insegnante(UPDATED_ID_INSEGNANTE);

        restInsegnanteCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInsegnanteCorso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInsegnanteCorso))
            )
            .andExpect(status().isOk());

        // Validate the InsegnanteCorso in the database
        List<InsegnanteCorso> insegnanteCorsoList = insegnanteCorsoRepository.findAll();
        assertThat(insegnanteCorsoList).hasSize(databaseSizeBeforeUpdate);
        InsegnanteCorso testInsegnanteCorso = insegnanteCorsoList.get(insegnanteCorsoList.size() - 1);
        assertThat(testInsegnanteCorso.getId_insegnante()).isEqualTo(UPDATED_ID_INSEGNANTE);
        assertThat(testInsegnanteCorso.getId_corso()).isEqualTo(DEFAULT_ID_CORSO);
        assertThat(testInsegnanteCorso.getMese()).isEqualTo(DEFAULT_MESE);
    }

    @Test
    @Transactional
    void fullUpdateInsegnanteCorsoWithPatch() throws Exception {
        // Initialize the database
        insegnanteCorsoRepository.saveAndFlush(insegnanteCorso);

        int databaseSizeBeforeUpdate = insegnanteCorsoRepository.findAll().size();

        // Update the insegnanteCorso using partial update
        InsegnanteCorso partialUpdatedInsegnanteCorso = new InsegnanteCorso();
        partialUpdatedInsegnanteCorso.setId(insegnanteCorso.getId());

        partialUpdatedInsegnanteCorso.id_insegnante(UPDATED_ID_INSEGNANTE).id_corso(UPDATED_ID_CORSO).mese(UPDATED_MESE);

        restInsegnanteCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInsegnanteCorso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInsegnanteCorso))
            )
            .andExpect(status().isOk());

        // Validate the InsegnanteCorso in the database
        List<InsegnanteCorso> insegnanteCorsoList = insegnanteCorsoRepository.findAll();
        assertThat(insegnanteCorsoList).hasSize(databaseSizeBeforeUpdate);
        InsegnanteCorso testInsegnanteCorso = insegnanteCorsoList.get(insegnanteCorsoList.size() - 1);
        assertThat(testInsegnanteCorso.getId_insegnante()).isEqualTo(UPDATED_ID_INSEGNANTE);
        assertThat(testInsegnanteCorso.getId_corso()).isEqualTo(UPDATED_ID_CORSO);
        assertThat(testInsegnanteCorso.getMese()).isEqualTo(UPDATED_MESE);
    }

    @Test
    @Transactional
    void patchNonExistingInsegnanteCorso() throws Exception {
        int databaseSizeBeforeUpdate = insegnanteCorsoRepository.findAll().size();
        insegnanteCorso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInsegnanteCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, insegnanteCorso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(insegnanteCorso))
            )
            .andExpect(status().isBadRequest());

        // Validate the InsegnanteCorso in the database
        List<InsegnanteCorso> insegnanteCorsoList = insegnanteCorsoRepository.findAll();
        assertThat(insegnanteCorsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInsegnanteCorso() throws Exception {
        int databaseSizeBeforeUpdate = insegnanteCorsoRepository.findAll().size();
        insegnanteCorso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInsegnanteCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(insegnanteCorso))
            )
            .andExpect(status().isBadRequest());

        // Validate the InsegnanteCorso in the database
        List<InsegnanteCorso> insegnanteCorsoList = insegnanteCorsoRepository.findAll();
        assertThat(insegnanteCorsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInsegnanteCorso() throws Exception {
        int databaseSizeBeforeUpdate = insegnanteCorsoRepository.findAll().size();
        insegnanteCorso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInsegnanteCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(insegnanteCorso))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InsegnanteCorso in the database
        List<InsegnanteCorso> insegnanteCorsoList = insegnanteCorsoRepository.findAll();
        assertThat(insegnanteCorsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInsegnanteCorso() throws Exception {
        // Initialize the database
        insegnanteCorsoRepository.saveAndFlush(insegnanteCorso);

        int databaseSizeBeforeDelete = insegnanteCorsoRepository.findAll().size();

        // Delete the insegnanteCorso
        restInsegnanteCorsoMockMvc
            .perform(delete(ENTITY_API_URL_ID, insegnanteCorso.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<InsegnanteCorso> insegnanteCorsoList = insegnanteCorsoRepository.findAll();
        assertThat(insegnanteCorsoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
