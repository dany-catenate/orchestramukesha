package com.catenate.orchestra.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.catenate.orchestra.IntegrationTest;
import com.catenate.orchestra.domain.Filmato;
import com.catenate.orchestra.repository.FilmatoRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link FilmatoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FilmatoResourceIT {

    private static final byte[] DEFAULT_BLOB = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_BLOB = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_BLOB_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_BLOB_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_NOME_FILE = "AAAAAAAAAA";
    private static final String UPDATED_NOME_FILE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/filmatoes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FilmatoRepository filmatoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFilmatoMockMvc;

    private Filmato filmato;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Filmato createEntity(EntityManager em) {
        Filmato filmato = new Filmato().blob(DEFAULT_BLOB).blobContentType(DEFAULT_BLOB_CONTENT_TYPE).nome_file(DEFAULT_NOME_FILE);
        return filmato;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Filmato createUpdatedEntity(EntityManager em) {
        Filmato filmato = new Filmato().blob(UPDATED_BLOB).blobContentType(UPDATED_BLOB_CONTENT_TYPE).nome_file(UPDATED_NOME_FILE);
        return filmato;
    }

    @BeforeEach
    public void initTest() {
        filmato = createEntity(em);
    }

    @Test
    @Transactional
    void createFilmato() throws Exception {
        int databaseSizeBeforeCreate = filmatoRepository.findAll().size();
        // Create the Filmato
        restFilmatoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(filmato)))
            .andExpect(status().isCreated());

        // Validate the Filmato in the database
        List<Filmato> filmatoList = filmatoRepository.findAll();
        assertThat(filmatoList).hasSize(databaseSizeBeforeCreate + 1);
        Filmato testFilmato = filmatoList.get(filmatoList.size() - 1);
        assertThat(testFilmato.getBlob()).isEqualTo(DEFAULT_BLOB);
        assertThat(testFilmato.getBlobContentType()).isEqualTo(DEFAULT_BLOB_CONTENT_TYPE);
        assertThat(testFilmato.getNome_file()).isEqualTo(DEFAULT_NOME_FILE);
    }

    @Test
    @Transactional
    void createFilmatoWithExistingId() throws Exception {
        // Create the Filmato with an existing ID
        filmato.setId(1L);

        int databaseSizeBeforeCreate = filmatoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFilmatoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(filmato)))
            .andExpect(status().isBadRequest());

        // Validate the Filmato in the database
        List<Filmato> filmatoList = filmatoRepository.findAll();
        assertThat(filmatoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFilmatoes() throws Exception {
        // Initialize the database
        filmatoRepository.saveAndFlush(filmato);

        // Get all the filmatoList
        restFilmatoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(filmato.getId().intValue())))
            .andExpect(jsonPath("$.[*].blobContentType").value(hasItem(DEFAULT_BLOB_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].blob").value(hasItem(Base64Utils.encodeToString(DEFAULT_BLOB))))
            .andExpect(jsonPath("$.[*].nome_file").value(hasItem(DEFAULT_NOME_FILE)));
    }

    @Test
    @Transactional
    void getFilmato() throws Exception {
        // Initialize the database
        filmatoRepository.saveAndFlush(filmato);

        // Get the filmato
        restFilmatoMockMvc
            .perform(get(ENTITY_API_URL_ID, filmato.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(filmato.getId().intValue()))
            .andExpect(jsonPath("$.blobContentType").value(DEFAULT_BLOB_CONTENT_TYPE))
            .andExpect(jsonPath("$.blob").value(Base64Utils.encodeToString(DEFAULT_BLOB)))
            .andExpect(jsonPath("$.nome_file").value(DEFAULT_NOME_FILE));
    }

    @Test
    @Transactional
    void getNonExistingFilmato() throws Exception {
        // Get the filmato
        restFilmatoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFilmato() throws Exception {
        // Initialize the database
        filmatoRepository.saveAndFlush(filmato);

        int databaseSizeBeforeUpdate = filmatoRepository.findAll().size();

        // Update the filmato
        Filmato updatedFilmato = filmatoRepository.findById(filmato.getId()).get();
        // Disconnect from session so that the updates on updatedFilmato are not directly saved in db
        em.detach(updatedFilmato);
        updatedFilmato.blob(UPDATED_BLOB).blobContentType(UPDATED_BLOB_CONTENT_TYPE).nome_file(UPDATED_NOME_FILE);

        restFilmatoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFilmato.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFilmato))
            )
            .andExpect(status().isOk());

        // Validate the Filmato in the database
        List<Filmato> filmatoList = filmatoRepository.findAll();
        assertThat(filmatoList).hasSize(databaseSizeBeforeUpdate);
        Filmato testFilmato = filmatoList.get(filmatoList.size() - 1);
        assertThat(testFilmato.getBlob()).isEqualTo(UPDATED_BLOB);
        assertThat(testFilmato.getBlobContentType()).isEqualTo(UPDATED_BLOB_CONTENT_TYPE);
        assertThat(testFilmato.getNome_file()).isEqualTo(UPDATED_NOME_FILE);
    }

    @Test
    @Transactional
    void putNonExistingFilmato() throws Exception {
        int databaseSizeBeforeUpdate = filmatoRepository.findAll().size();
        filmato.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFilmatoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, filmato.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(filmato))
            )
            .andExpect(status().isBadRequest());

        // Validate the Filmato in the database
        List<Filmato> filmatoList = filmatoRepository.findAll();
        assertThat(filmatoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFilmato() throws Exception {
        int databaseSizeBeforeUpdate = filmatoRepository.findAll().size();
        filmato.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFilmatoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(filmato))
            )
            .andExpect(status().isBadRequest());

        // Validate the Filmato in the database
        List<Filmato> filmatoList = filmatoRepository.findAll();
        assertThat(filmatoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFilmato() throws Exception {
        int databaseSizeBeforeUpdate = filmatoRepository.findAll().size();
        filmato.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFilmatoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(filmato)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Filmato in the database
        List<Filmato> filmatoList = filmatoRepository.findAll();
        assertThat(filmatoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFilmatoWithPatch() throws Exception {
        // Initialize the database
        filmatoRepository.saveAndFlush(filmato);

        int databaseSizeBeforeUpdate = filmatoRepository.findAll().size();

        // Update the filmato using partial update
        Filmato partialUpdatedFilmato = new Filmato();
        partialUpdatedFilmato.setId(filmato.getId());

        partialUpdatedFilmato.blob(UPDATED_BLOB).blobContentType(UPDATED_BLOB_CONTENT_TYPE);

        restFilmatoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFilmato.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFilmato))
            )
            .andExpect(status().isOk());

        // Validate the Filmato in the database
        List<Filmato> filmatoList = filmatoRepository.findAll();
        assertThat(filmatoList).hasSize(databaseSizeBeforeUpdate);
        Filmato testFilmato = filmatoList.get(filmatoList.size() - 1);
        assertThat(testFilmato.getBlob()).isEqualTo(UPDATED_BLOB);
        assertThat(testFilmato.getBlobContentType()).isEqualTo(UPDATED_BLOB_CONTENT_TYPE);
        assertThat(testFilmato.getNome_file()).isEqualTo(DEFAULT_NOME_FILE);
    }

    @Test
    @Transactional
    void fullUpdateFilmatoWithPatch() throws Exception {
        // Initialize the database
        filmatoRepository.saveAndFlush(filmato);

        int databaseSizeBeforeUpdate = filmatoRepository.findAll().size();

        // Update the filmato using partial update
        Filmato partialUpdatedFilmato = new Filmato();
        partialUpdatedFilmato.setId(filmato.getId());

        partialUpdatedFilmato.blob(UPDATED_BLOB).blobContentType(UPDATED_BLOB_CONTENT_TYPE).nome_file(UPDATED_NOME_FILE);

        restFilmatoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFilmato.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFilmato))
            )
            .andExpect(status().isOk());

        // Validate the Filmato in the database
        List<Filmato> filmatoList = filmatoRepository.findAll();
        assertThat(filmatoList).hasSize(databaseSizeBeforeUpdate);
        Filmato testFilmato = filmatoList.get(filmatoList.size() - 1);
        assertThat(testFilmato.getBlob()).isEqualTo(UPDATED_BLOB);
        assertThat(testFilmato.getBlobContentType()).isEqualTo(UPDATED_BLOB_CONTENT_TYPE);
        assertThat(testFilmato.getNome_file()).isEqualTo(UPDATED_NOME_FILE);
    }

    @Test
    @Transactional
    void patchNonExistingFilmato() throws Exception {
        int databaseSizeBeforeUpdate = filmatoRepository.findAll().size();
        filmato.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFilmatoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, filmato.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(filmato))
            )
            .andExpect(status().isBadRequest());

        // Validate the Filmato in the database
        List<Filmato> filmatoList = filmatoRepository.findAll();
        assertThat(filmatoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFilmato() throws Exception {
        int databaseSizeBeforeUpdate = filmatoRepository.findAll().size();
        filmato.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFilmatoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(filmato))
            )
            .andExpect(status().isBadRequest());

        // Validate the Filmato in the database
        List<Filmato> filmatoList = filmatoRepository.findAll();
        assertThat(filmatoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFilmato() throws Exception {
        int databaseSizeBeforeUpdate = filmatoRepository.findAll().size();
        filmato.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFilmatoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(filmato)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Filmato in the database
        List<Filmato> filmatoList = filmatoRepository.findAll();
        assertThat(filmatoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFilmato() throws Exception {
        // Initialize the database
        filmatoRepository.saveAndFlush(filmato);

        int databaseSizeBeforeDelete = filmatoRepository.findAll().size();

        // Delete the filmato
        restFilmatoMockMvc
            .perform(delete(ENTITY_API_URL_ID, filmato.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Filmato> filmatoList = filmatoRepository.findAll();
        assertThat(filmatoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
