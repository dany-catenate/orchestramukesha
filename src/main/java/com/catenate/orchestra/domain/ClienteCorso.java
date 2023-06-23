package com.catenate.orchestra.domain;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * A ClienteCorso.
 */
@Entity
@Table(name = "cliente_corso")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ClienteCorso implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "id_cliente")
    private Long id_cliente;

    @Column(name = "id_corso")
    private Long id_corso;

    @Column(name = "mese")
    private Integer mese;

    @Column(name = "pagato")
    private Boolean pagato;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ClienteCorso id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId_cliente() {
        return this.id_cliente;
    }

    public ClienteCorso id_cliente(Long id_cliente) {
        this.setId_cliente(id_cliente);
        return this;
    }

    public void setId_cliente(Long id_cliente) {
        this.id_cliente = id_cliente;
    }

    public Long getId_corso() {
        return this.id_corso;
    }

    public ClienteCorso id_corso(Long id_corso) {
        this.setId_corso(id_corso);
        return this;
    }

    public void setId_corso(Long id_corso) {
        this.id_corso = id_corso;
    }

    public Integer getMese() {
        return this.mese;
    }

    public ClienteCorso mese(Integer mese) {
        this.setMese(mese);
        return this;
    }

    public void setMese(Integer mese) {
        this.mese = mese;
    }

    public Boolean getPagato() {
        return this.pagato;
    }

    public ClienteCorso pagato(Boolean pagato) {
        this.setPagato(pagato);
        return this;
    }

    public void setPagato(Boolean pagato) {
        this.pagato = pagato;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ClienteCorso)) {
            return false;
        }
        return id != null && id.equals(((ClienteCorso) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ClienteCorso{" +
            "id=" + getId() +
            ", id_cliente=" + getId_cliente() +
            ", id_corso=" + getId_corso() +
            ", mese=" + getMese() +
            ", pagato='" + getPagato() + "'" +
            "}";
    }
}
