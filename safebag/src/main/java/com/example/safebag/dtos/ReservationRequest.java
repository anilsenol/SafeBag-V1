package com.example.safebag.dtos;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;

@Getter@Setter
public class ReservationRequest {

	private int reservationNumber;
	private int bagCount;
	private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int shopId;
}
