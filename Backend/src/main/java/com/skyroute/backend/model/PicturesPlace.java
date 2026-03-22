package com.skyroute.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pictures_place")
public class PicturesPlace {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String path;

	@ManyToOne
	@JoinColumn(name = "place_id", nullable = false)
	@com.fasterxml.jackson.annotation.JsonBackReference("place-pictures")
	private Places place;

	public PicturesPlace() {
	}

	public PicturesPlace(Long id, String path, Places place) {
		this.id = id;
		this.path = path;
		this.place = place;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Places getPlace() {
		return place;
	}

	public void setPlace(Places place) {
		this.place = place;
	}
}