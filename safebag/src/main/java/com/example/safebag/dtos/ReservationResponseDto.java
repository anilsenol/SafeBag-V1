package com.example.safebag.dtos;

import java.time.LocalDate;
import java.time.LocalTime;
import com.example.safebag.entities.Reservation;
import com.example.safebag.entities.ReservationStatus;
import lombok.Data;


@Data
public class ReservationResponseDto {
	private int id;
	private int bagCount;
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int reservationNumber;
    private UserDto traveller;
    private ShopDto shop;
	private ReservationStatus status;
	private String customerName;

    
    public ReservationResponseDto(Reservation reservation) {
        this.id = reservation.getId();
        this.bagCount = reservation.getBagCount();
        this.reservationDate = reservation.getReservationDate();
        this.startTime = reservation.getStartTime();
        this.endTime = reservation.getEndTime();
        this.reservationNumber = reservation.getReservationNumber();
        this.traveller = new UserDto(reservation.getTraveller());
        this.shop = new ShopDto(reservation.getShop());
        this.status = reservation.getStatus();
        this.customerName = reservation.getTraveller().getFirstName() + " " + reservation.getTraveller().getLastName();
    }
    
    
}

