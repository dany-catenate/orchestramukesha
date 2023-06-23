package com.catenate.orchestra.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.catenate.orchestra.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FilmatoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Filmato.class);
        Filmato filmato1 = new Filmato();
        filmato1.setId(1L);
        Filmato filmato2 = new Filmato();
        filmato2.setId(filmato1.getId());
        assertThat(filmato1).isEqualTo(filmato2);
        filmato2.setId(2L);
        assertThat(filmato1).isNotEqualTo(filmato2);
        filmato1.setId(null);
        assertThat(filmato1).isNotEqualTo(filmato2);
    }
}
