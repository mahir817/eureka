package com.eureka.eureka.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;
    
    @Column
    private String profession;
    
    @Column
    private Long graduationYear;
    
    @Column
    private String institute;
    
    @Column
    private String stream;
    
    @Column
    private Integer ratings = 1200;
    
    @Column
    private Integer brainCoins = 0;

    // Constructors
    public User() {
    }

    public User(String username, String password, String name, String profession, 
                Long graduationYear, String institute, String stream) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.profession = profession;
        this.graduationYear = graduationYear;
        this.institute = institute;
        this.stream = stream;
        this.ratings = 1200;
        this.brainCoins = 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    public Long getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Long graduationYear) {
        this.graduationYear = graduationYear;
    }

    public String getInstitute() {
        return institute;
    }

    public void setInstitute(String institute) {
        this.institute = institute;
    }

    public String getStream() {
        return stream;
    }

    public void setStream(String stream) {
        this.stream = stream;
    }

    public Integer getRatings() {
        return ratings;
    }

    public void setRatings(Integer ratings) {
        this.ratings = ratings;
    }

    public Integer getBrainCoins() {
        return brainCoins;
    }

    public void setBrainCoins(Integer brainCoins) {
        this.brainCoins = brainCoins;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", name='" + name + '\'' +
                ", institute='" + institute + '\'' +
                ", ratings=" + ratings +
                '}';
    }
}

