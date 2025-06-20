package com.example.safebag.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.safebag.dtos.ReservationRequest;
import com.example.safebag.dtos.ReservationResponseDto;
import com.example.safebag.services.ReservationService;

@RestController
@RequestMapping("/api/reservation")
public class ReservationController {
		
	@Autowired
	private ReservationService reservationService;
	
	@PostMapping("/create")
	public void makeReservation(@RequestBody ReservationRequest reservationRequest , 
			@AuthenticationPrincipal UserDetails userDetails) {
		
		String email = userDetails.getUsername();
		 reservationService.makeReservation(reservationRequest, email);
	}
	
	@GetMapping("/traveler/myreservations")
	public List<ReservationResponseDto> findAllReservationsOfTraveler(@AuthenticationPrincipal UserDetails userDetails){
		String email = userDetails.getUsername();
		return reservationService.findAllReservationsOfTraveler(email);
	}
	
	@GetMapping("/shop/myreservations")
	public List<ReservationResponseDto> findAllReservationsOfShopOwner(@AuthenticationPrincipal UserDetails userDetails){
		String email = userDetails.getUsername();
		return reservationService.findAllReservationsOfShopOwner(email);
	}
	
	 @PutMapping("/cancel/{reservationNumber}")
	    public ResponseEntity<String> cancelReservation(@PathVariable Integer reservationNumber) {
	        reservationService.cancelReservation(reservationNumber);
	        return ResponseEntity.ok("Reservation canceled successfully.");
	    }

}
