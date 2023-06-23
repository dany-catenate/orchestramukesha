package com.catenate.orchestra.domain;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * A Corso.
 */
@Entity
@Table(name = "corso")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Corso implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "anno")
    private Integer anno;

    @Column(name = "nome")
    private String nome;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Corso id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAnno() {
        return this.anno;
    }

    public Corso anno(Integer anno) {
        this.setAnno(anno);
        return this;
    }

    public void setAnno(Integer anno) {
        this.anno = anno;
    }

    public String getNome() {
        return this.nome;
    }

    public Corso nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Corso)) {
            return false;
        }
        return id != null && id.equals(((Corso) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Corso{" +
            "id=" + getId() +
            ", anno=" + getAnno() +
            ", nome='" + getNome() + "'" +
            "}";
    }
}
