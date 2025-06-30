package com.sba.pojo;

import jakarta.persistence.*;


@Entity
@Table(name = "orchid")
public class Orchid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long orchidId;

    @Column(name = "is_natural", nullable = false)
    private Boolean isNatural;

    @Column(name = "orchid_description", nullable = false, length = 500)
    private String orchidDescription;

    @Column(name = "orchid_name", nullable = false, unique = true, length = 100)
    private String orchidName;

    @Column(name = "orchid_url", nullable = false, length = 255)
    private String orchidUrl;

    @Column(name = "price", nullable = false)
    private Double price;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public Long getOrchidId() {
        return orchidId;
    }

    public void setOrchidId(Long orchidId) {
        this.orchidId = orchidId;
    }

    public Boolean getNatural() {
        return isNatural;
    }

    public void setNatural(Boolean natural) {
        isNatural = natural;
    }

    public String getOrchidDescription() {
        return orchidDescription;
    }

    public void setOrchidDescription(String orchidDescription) {
        this.orchidDescription = orchidDescription;
    }

    public String getOrchidName() {
        return orchidName;
    }

    public void setOrchidName(String orchidName) {
        this.orchidName = orchidName;
    }

    public String getOrchidUrl() {
        return orchidUrl;
    }

    public void setOrchidUrl(String orchidUrl) {
        this.orchidUrl = orchidUrl;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Orchid(Boolean isNatural, String orchidDescription, String orchidName, String orchidUrl, Double price) {
        this.isNatural = isNatural;
        this.orchidDescription = orchidDescription;
        this.orchidName = orchidName;
        this.orchidUrl = orchidUrl;
        this.price = price;
    }

    public Orchid(Long orchidId, Boolean isNatural, String orchidDescription, String orchidName, String orchidUrl, Double price) {
        this.orchidId = orchidId;
        this.isNatural = isNatural;
        this.orchidDescription = orchidDescription;
        this.orchidName = orchidName;
        this.orchidUrl = orchidUrl;
        this.price = price;
    }

    public Orchid(Boolean isNatural, String orchidDescription, String orchidName, String orchidUrl, Double price, Category category) {
        this.isNatural = isNatural;
        this.orchidDescription = orchidDescription;
        this.orchidName = orchidName;
        this.orchidUrl = orchidUrl;
        this.price = price;
        this.category = category;
    }

    public Orchid(Long orchidId, Boolean isNatural, String orchidDescription, String orchidName, String orchidUrl, Double price, Category category) {
        this.orchidId = orchidId;
        this.isNatural = isNatural;
        this.orchidDescription = orchidDescription;
        this.orchidName = orchidName;
        this.orchidUrl = orchidUrl;
        this.price = price;
        this.category = category;
    }

    public Orchid() {
    }
}
