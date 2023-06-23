package com.catenate.orchestra.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;

/**
 * A Filmato.
 */
@Entity
@Table(name = "filmato")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Filmato implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Lob
    @Column(name = "jhi_blob")
    private byte[] blob;

    @Column(name = "jhi_blob_content_type")
    private String blobContentType;

    @Column(name = "nome_file")
    private String nome_file;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "fotos", "filmatoes", "corso" }, allowSetters = true)
    private Concerto concerto;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Filmato id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getBlob() {
        return this.blob;
    }

    public Filmato blob(byte[] blob) {
        this.setBlob(blob);
        return this;
    }

    public void setBlob(byte[] blob) {
        this.blob = blob;
    }

    public String getBlobContentType() {
        return this.blobContentType;
    }

    public Filmato blobContentType(String blobContentType) {
        this.blobContentType = blobContentType;
        return this;
    }

    public void setBlobContentType(String blobContentType) {
        this.blobContentType = blobContentType;
    }

    public String getNome_file() {
        return this.nome_file;
    }

    public Filmato nome_file(String nome_file) {
        this.setNome_file(nome_file);
        return this;
    }

    public void setNome_file(String nome_file) {
        this.nome_file = nome_file;
    }

    public Concerto getConcerto() {
        return this.concerto;
    }

    public void setConcerto(Concerto concerto) {
        this.concerto = concerto;
    }

    public Filmato concerto(Concerto concerto) {
        this.setConcerto(concerto);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Filmato)) {
            return false;
        }
        return id != null && id.equals(((Filmato) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Filmato{" +
            "id=" + getId() +
            ", blob='" + getBlob() + "'" +
            ", blobContentType='" + getBlobContentType() + "'" +
            ", nome_file='" + getNome_file() + "'" +
            "}";
    }
}
