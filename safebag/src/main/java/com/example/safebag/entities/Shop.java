package com.example.safebag.entities;

import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter@Setter
@NoArgsConstructor@AllArgsConstructor
public class Shop {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@NotNull
	private String name;
	@NotNull
	private String country;
	@NotNull
	private String city;
	@NotNull
	private LocalTime openingHour;
	@NotNull
	private LocalTime closingHour;
	@NotNull
	private int capacity;
	@NotNull
	private String closedDay;
	@NotNull
	private String address;
	@NotNull
	private String addressDescription;
	
	@Enumerated(EnumType.STRING)
	private ShopStatus status;
	 
	@Column(nullable = true)
	 private double latitude;
	@Column(nullable = true)
	 private double longitude;
	
	@ManyToOne
	@JoinColumn(name = "shopOwner_id")
	private User shopOwner;

}
