package com.catenate.orchestra.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.catenate.orchestra.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InsegnanteCorsoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(InsegnanteCorso.class);
        InsegnanteCorso insegnanteCorso1 = new InsegnanteCorso();
        insegnanteCorso1.setId(1L);
        InsegnanteCorso insegnanteCorso2 = new InsegnanteCorso();
        insegnanteCorso2.setId(insegnanteCorso1.getId());
        assertThat(insegnanteCorso1).isEqualTo(insegnanteCorso2);
        insegnanteCorso2.setId(2L);
        assertThat(insegnanteCorso1).isNotEqualTo(insegnanteCorso2);
        insegnanteCorso1.setId(null);
        assertThat(insegnanteCorso1).isNotEqualTo(insegnanteCorso2);
    }
}
