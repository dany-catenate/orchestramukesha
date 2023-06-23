package com.catenate.orchestra.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.catenate.orchestra.IntegrationTest;
import com.catenate.orchestra.domain.ClienteCorso;
import com.catenate.orchestra.repository.ClienteCorsoRepository;
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
 * Integration tests for the {@link ClienteCorsoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClienteCorsoResourceIT {

    private static final Long DEFAULT_ID_CLIENTE = 1L;
    private static final Long UPDATED_ID_CLIENTE = 2L;

    private static final Long DEFAULT_ID_CORSO = 1L;
    private static final Long UPDATED_ID_CORSO = 2L;

    private static final Integer DEFAULT_MESE = 1;
    private static final Integer UPDATED_MESE = 2;

    private static final Boolean DEFAULT_PAGATO = false;
    private static final Boolean UPDATED_PAGATO = true;

    private static final String ENTITY_API_URL = "/api/cliente-corsos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClienteCorsoRepository clienteCorsoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClienteCorsoMockMvc;

    private ClienteCorso clienteCorso;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClienteCorso createEntity(EntityManager em) {
        ClienteCorso clienteCorso = new ClienteCorso()
            .id_cliente(DEFAULT_ID_CLIENTE)
            .id_corso(DEFAULT_ID_CORSO)
            .mese(DEFAULT_MESE)
            .pagato(DEFAULT_PAGATO);
        return clienteCorso;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ClienteCorso createUpdatedEntity(EntityManager em) {
        ClienteCorso clienteCorso = new ClienteCorso()
            .id_cliente(UPDATED_ID_CLIENTE)
            .id_corso(UPDATED_ID_CORSO)
            .mese(UPDATED_MESE)
            .pagato(UPDATED_PAGATO);
        return clienteCorso;
    }

    @BeforeEach
    public void initTest() {
        clienteCorso = createEntity(em);
    }

    @Test
    @Transactional
    void createClienteCorso() throws Exception {
        int databaseSizeBeforeCreate = clienteCorsoRepository.findAll().size();
        // Create the ClienteCorso
        restClienteCorsoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clienteCorso)))
            .andExpect(status().isCreated());

        // Validate the ClienteCorso in the database
        List<ClienteCorso> clienteCorsoList = clienteCorsoRepository.findAll();
        assertThat(clienteCorsoList).hasSize(databaseSizeBeforeCreate + 1);
        ClienteCorso testClienteCorso = clienteCorsoList.get(clienteCorsoList.size() - 1);
        assertThat(testClienteCorso.getId_cliente()).isEqualTo(DEFAULT_ID_CLIENTE);
        assertThat(testClienteCorso.getId_corso()).isEqualTo(DEFAULT_ID_CORSO);
        assertThat(testClienteCorso.getMese()).isEqualTo(DEFAULT_MESE);
        assertThat(testClienteCorso.getPagato()).isEqualTo(DEFAULT_PAGATO);
    }

    @Test
    @Transactional
    void createClienteCorsoWithExistingId() throws Exception {
        // Create the ClienteCorso with an existing ID
        clienteCorso.setId(1L);

        int databaseSizeBeforeCreate = clienteCorsoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClienteCorsoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clienteCorso)))
            .andExpect(status().isBadRequest());

        // Validate the ClienteCorso in the database
        List<ClienteCorso> clienteCorsoList = clienteCorsoRepository.findAll();
        assertThat(clienteCorsoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClienteCorsos() throws Exception {
        // Initialize the database
        clienteCorsoRepository.saveAndFlush(clienteCorso);

        // Get all the clienteCorsoList
        restClienteCorsoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(clienteCorso.getId().intValue())))
            .andExpect(jsonPath("$.[*].id_cliente").value(hasItem(DEFAULT_ID_CLIENTE.intValue())))
            .andExpect(jsonPath("$.[*].id_corso").value(hasItem(DEFAULT_ID_CORSO.intValue())))
            .andExpect(jsonPath("$.[*].mese").value(hasItem(DEFAULT_MESE)))
            .andExpect(jsonPath("$.[*].pagato").value(hasItem(DEFAULT_PAGATO.booleanValue())));
    }

    @Test
    @Transactional
    void getClienteCorso() throws Exception {
        // Initialize the database
        clienteCorsoRepository.saveAndFlush(clienteCorso);

        // Get the clienteCorso
        restClienteCorsoMockMvc
            .perform(get(ENTITY_API_URL_ID, clienteCorso.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(clienteCorso.getId().intValue()))
            .andExpect(jsonPath("$.id_cliente").value(DEFAULT_ID_CLIENTE.intValue()))
            .andExpect(jsonPath("$.id_corso").value(DEFAULT_ID_CORSO.intValue()))
            .andExpect(jsonPath("$.mese").value(DEFAULT_MESE))
            .andExpect(jsonPath("$.pagato").value(DEFAULT_PAGATO.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingClienteCorso() throws Exception {
        // Get the clienteCorso
        restClienteCorsoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClienteCorso() throws Exception {
        // Initialize the database
        clienteCorsoRepository.saveAndFlush(clienteCorso);

        int databaseSizeBeforeUpdate = clienteCorsoRepository.findAll().size();

        // Update the clienteCorso
        ClienteCorso updatedClienteCorso = clienteCorsoRepository.findById(clienteCorso.getId()).get();
        // Disconnect from session so that the updates on updatedClienteCorso are not directly saved in db
        em.detach(updatedClienteCorso);
        updatedClienteCorso.id_cliente(UPDATED_ID_CLIENTE).id_corso(UPDATED_ID_CORSO).mese(UPDATED_MESE).pagato(UPDATED_PAGATO);

        restClienteCorsoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClienteCorso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClienteCorso))
            )
            .andExpect(status().isOk());

        // Validate the ClienteCorso in the database
        List<ClienteCorso> clienteCorsoList = clienteCorsoRepository.findAll();
        assertThat(clienteCorsoList).hasSize(databaseSizeBeforeUpdate);
        ClienteCorso testClienteCorso = clienteCorsoList.get(clienteCorsoList.size() - 1);
        assertThat(testClienteCorso.getId_cliente()).isEqualTo(UPDATED_ID_CLIENTE);
        assertThat(testClienteCorso.getId_corso()).isEqualTo(UPDATED_ID_CORSO);
        assertThat(testClienteCorso.getMese()).isEqualTo(UPDATED_MESE);
        assertThat(testClienteCorso.getPagato()).isEqualTo(UPDATED_PAGATO);
    }

    @Test
    @Transactional
    void putNonExistingClienteCorso() throws Exception {
        int databaseSizeBeforeUpdate = clienteCorsoRepository.findAll().size();
        clienteCorso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClienteCorsoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, clienteCorso.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clienteCorso))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClienteCorso in the database
        List<ClienteCorso> clienteCorsoList = clienteCorsoRepository.findAll();
        assertThat(clienteCorsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClienteCorso() throws Exception {
        int databaseSizeBeforeUpdate = clienteCorsoRepository.findAll().size();
        clienteCorso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClienteCorsoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(clienteCorso))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClienteCorso in the database
        List<ClienteCorso> clienteCorsoList = clienteCorsoRepository.findAll();
        assertThat(clienteCorsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClienteCorso() throws Exception {
        int databaseSizeBeforeUpdate = clienteCorsoRepository.findAll().size();
        clienteCorso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClienteCorsoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(clienteCorso)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClienteCorso in the database
        List<ClienteCorso> clienteCorsoList = clienteCorsoRepository.findAll();
        assertThat(clienteCorsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClienteCorsoWithPatch() throws Exception {
        // Initialize the database
        clienteCorsoRepository.saveAndFlush(clienteCorso);

        int databaseSizeBeforeUpdate = clienteCorsoRepository.findAll().size();

        // Update the clienteCorso using partial update
        ClienteCorso partialUpdatedClienteCorso = new ClienteCorso();
        partialUpdatedClienteCorso.setId(clienteCorso.getId());

        partialUpdatedClienteCorso.pagato(UPDATED_PAGATO);

        restClienteCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClienteCorso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClienteCorso))
            )
            .andExpect(status().isOk());

        // Validate the ClienteCorso in the database
        List<ClienteCorso> clienteCorsoList = clienteCorsoRepository.findAll();
        assertThat(clienteCorsoList).hasSize(databaseSizeBeforeUpdate);
        ClienteCorso testClienteCorso = clienteCorsoList.get(clienteCorsoList.size() - 1);
        assertThat(testClienteCorso.getId_cliente()).isEqualTo(DEFAULT_ID_CLIENTE);
        assertThat(testClienteCorso.getId_corso()).isEqualTo(DEFAULT_ID_CORSO);
        assertThat(testClienteCorso.getMese()).isEqualTo(DEFAULT_MESE);
        assertThat(testClienteCorso.getPagato()).isEqualTo(UPDATED_PAGATO);
    }

    @Test
    @Transactional
    void fullUpdateClienteCorsoWithPatch() throws Exception {
        // Initialize the database
        clienteCorsoRepository.saveAndFlush(clienteCorso);

        int databaseSizeBeforeUpdate = clienteCorsoRepository.findAll().size();

        // Update the clienteCorso using partial update
        ClienteCorso partialUpdatedClienteCorso = new ClienteCorso();
        partialUpdatedClienteCorso.setId(clienteCorso.getId());

        partialUpdatedClienteCorso.id_cliente(UPDATED_ID_CLIENTE).id_corso(UPDATED_ID_CORSO).mese(UPDATED_MESE).pagato(UPDATED_PAGATO);

        restClienteCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClienteCorso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClienteCorso))
            )
            .andExpect(status().isOk());

        // Validate the ClienteCorso in the database
        List<ClienteCorso> clienteCorsoList = clienteCorsoRepository.findAll();
        assertThat(clienteCorsoList).hasSize(databaseSizeBeforeUpdate);
        ClienteCorso testClienteCorso = clienteCorsoList.get(clienteCorsoList.size() - 1);
        assertThat(testClienteCorso.getId_cliente()).isEqualTo(UPDATED_ID_CLIENTE);
        assertThat(testClienteCorso.getId_corso()).isEqualTo(UPDATED_ID_CORSO);
        assertThat(testClienteCorso.getMese()).isEqualTo(UPDATED_MESE);
        assertThat(testClienteCorso.getPagato()).isEqualTo(UPDATED_PAGATO);
    }

    @Test
    @Transactional
    void patchNonExistingClienteCorso() throws Exception {
        int databaseSizeBeforeUpdate = clienteCorsoRepository.findAll().size();
        clienteCorso.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClienteCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, clienteCorso.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clienteCorso))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClienteCorso in the database
        List<ClienteCorso> clienteCorsoList = clienteCorsoRepository.findAll();
        assertThat(clienteCorsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClienteCorso() throws Exception {
        int databaseSizeBeforeUpdate = clienteCorsoRepository.findAll().size();
        clienteCorso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClienteCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(clienteCorso))
            )
            .andExpect(status().isBadRequest());

        // Validate the ClienteCorso in the database
        List<ClienteCorso> clienteCorsoList = clienteCorsoRepository.findAll();
        assertThat(clienteCorsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClienteCorso() throws Exception {
        int databaseSizeBeforeUpdate = clienteCorsoRepository.findAll().size();
        clienteCorso.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClienteCorsoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(clienteCorso))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ClienteCorso in the database
        List<ClienteCorso> clienteCorsoList = clienteCorsoRepository.findAll();
        assertThat(clienteCorsoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClienteCorso() throws Exception {
        // Initialize the database
        clienteCorsoRepository.saveAndFlush(clienteCorso);

        int databaseSizeBeforeDelete = clienteCorsoRepository.findAll().size();

        // Delete the clienteCorso
        restClienteCorsoMockMvc
            .perform(delete(ENTITY_API_URL_ID, clienteCorso.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ClienteCorso> clienteCorsoList = clienteCorsoRepository.findAll();
        assertThat(clienteCorsoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
