package com.example.safebag.entities;

import java.time.LocalDate;
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
public class Reservation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@NotNull
	private int bagCount;
	
	@NotNull
	private LocalDate reservationDate;
	@NotNull
	private LocalTime startTime;
	@NotNull
	private LocalTime endTime;
	
	@Column(unique = true)
	private int reservationNumber;
	
	@Column(name = "status")
	@Enumerated(EnumType.STRING)
	private ReservationStatus status;
	
	@ManyToOne
	@JoinColumn(name = "traveller_id")
	private User traveller;
	
	@ManyToOne
	@JoinColumn(name = "shopOwner_id")
	private Shop shop;
	
}
