package com.example.DemoAdmin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Nationalized;

@Getter
@Setter
@ToString
@Entity
@Table(name = "Cast")
public class Cast {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CastId", nullable = false)
    private Integer id;

    @Size(max = 100)
    @Column(name = "Name", nullable = false)
    private String name;

    @Size(max = 200)
    @Nationalized
    @Column(name = "Avatar", length = 200)
    private String avatar;
}
