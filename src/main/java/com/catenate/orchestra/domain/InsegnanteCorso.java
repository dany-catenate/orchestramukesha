package com.catenate.orchestra.domain;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * A InsegnanteCorso.
 */
@Entity
@Table(name = "insegnante_corso")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class InsegnanteCorso implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "id_insegnante")
    private Long id_insegnante;

    @Column(name = "id_corso")
    private Long id_corso;

    @Column(name = "mese")
    private Integer mese;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public InsegnanteCorso id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId_insegnante() {
        return this.id_insegnante;
    }

    public InsegnanteCorso id_insegnante(Long id_insegnante) {
        this.setId_insegnante(id_insegnante);
        return this;
    }

    public void setId_insegnante(Long id_insegnante) {
        this.id_insegnante = id_insegnante;
    }

    public Long getId_corso() {
        return this.id_corso;
    }

    public InsegnanteCorso id_corso(Long id_corso) {
        this.setId_corso(id_corso);
        return this;
    }

    public void setId_corso(Long id_corso) {
        this.id_corso = id_corso;
    }

    public Integer getMese() {
        return this.mese;
    }

    public InsegnanteCorso mese(Integer mese) {
        this.setMese(mese);
        return this;
    }

    public void setMese(Integer mese) {
        this.mese = mese;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof InsegnanteCorso)) {
            return false;
        }
        return id != null && id.equals(((InsegnanteCorso) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "InsegnanteCorso{" +
            "id=" + getId() +
            ", id_insegnante=" + getId_insegnante() +
            ", id_corso=" + getId_corso() +
            ", mese=" + getMese() +
            "}";
    }
}
