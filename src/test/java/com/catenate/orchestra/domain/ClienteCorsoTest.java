package com.catenate.orchestra.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.catenate.orchestra.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ClienteCorsoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ClienteCorso.class);
        ClienteCorso clienteCorso1 = new ClienteCorso();
        clienteCorso1.setId(1L);
        ClienteCorso clienteCorso2 = new ClienteCorso();
        clienteCorso2.setId(clienteCorso1.getId());
        assertThat(clienteCorso1).isEqualTo(clienteCorso2);
        clienteCorso2.setId(2L);
        assertThat(clienteCorso1).isNotEqualTo(clienteCorso2);
        clienteCorso1.setId(null);
        assertThat(clienteCorso1).isNotEqualTo(clienteCorso2);
    }
}
