package starshed.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Galary.
 */
@Entity
@Table(name = "galary")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Galary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "galary_name")
    private String galaryName;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGalaryName() {
        return galaryName;
    }

    public Galary galaryName(String galaryName) {
        this.galaryName = galaryName;
        return this;
    }

    public void setGalaryName(String galaryName) {
        this.galaryName = galaryName;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Galary galary = (Galary) o;
        if (galary.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), galary.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Galary{" +
            "id=" + getId() +
            ", galaryName='" + getGalaryName() + "'" +
            "}";
    }
}
