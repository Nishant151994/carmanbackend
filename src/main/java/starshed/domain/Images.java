package starshed.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Images.
 */
@Entity
@Table(name = "images")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Images implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @ManyToOne
    private Galary galary;

    @ManyToOne
    private Activities activity;

    @ManyToOne
    private Facilities facilities;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Images name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getImage() {
        return image;
    }

    public Images image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public Images imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Galary getGalary() {
        return galary;
    }

    public Images galary(Galary galary) {
        this.galary = galary;
        return this;
    }

    public void setGalary(Galary galary) {
        this.galary = galary;
    }

    public Activities getActivity() {
        return activity;
    }

    public Images activity(Activities activities) {
        this.activity = activities;
        return this;
    }

    public void setActivity(Activities activities) {
        this.activity = activities;
    }

    public Facilities getFacilities() {
        return facilities;
    }

    public Images facilities(Facilities facilities) {
        this.facilities = facilities;
        return this;
    }

    public void setFacilities(Facilities facilities) {
        this.facilities = facilities;
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
        Images images = (Images) o;
        if (images.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), images.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Images{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            "}";
    }
}
