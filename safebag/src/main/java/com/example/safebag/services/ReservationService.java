package com.example.safebag.services;

import java.util.Random;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.example.safebag.dtos.ReservationRequest;
import com.example.safebag.dtos.ReservationResponseDto;
import com.example.safebag.entities.Reservation;
import com.example.safebag.entities.ReservationStatus;
import com.example.safebag.entities.Shop;
import com.example.safebag.entities.User;
import com.example.safebag.repositories.IReservationRepository;
import com.example.safebag.repositories.IShopRepository;
import com.example.safebag.repositories.IUserRepository;

@Service
public class ReservationService {

	@Autowired
	private IReservationRepository reservationRepository;
	
	@Autowired
	private IUserRepository userRepository;
	
	@Autowired
	private IShopRepository shopRepository;
	
	public void makeReservation(ReservationRequest reservationRequest, String email) {
	    User traveller = userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("Traveller not found"));

	    Shop shop = shopRepository.findById(reservationRequest.getShopId())
	            .orElseThrow(() -> new RuntimeException("Shop not found"));

	    // === KAPALI GÜN KONTROLÜ ===
	    String reservationDay = reservationRequest.getReservationDate().getDayOfWeek().name().toLowerCase();
	    String shopClosedDay = shop.getClosedDay() != null ? shop.getClosedDay().toLowerCase() : "";
	    if (reservationDay.equals(shopClosedDay)) {
	        throw new RuntimeException("Reservation cannot be made on the shop's closed day.");
	    }
	 // === AÇILIŞ-KAPANIŞ SAATİ KONTROLÜ ===
	    LocalTime openingTime = shop.getOpeningHour();     
	    LocalTime closingTime = shop.getClosingHour();     
	    LocalTime startTime = reservationRequest.getStartTime();
	    LocalTime endTime = reservationRequest.getEndTime();

	    boolean isValidReservation = false;

	    if (openingTime.isBefore(closingTime) || openingTime.equals(closingTime)) {
	   
	        isValidReservation = !startTime.isBefore(openingTime) && !endTime.isAfter(closingTime);
	    } else {
	      
	       

	        boolean isStartInEvening = !startTime.isBefore(openingTime);  
	        boolean isEndInEvening = !endTime.isBefore(openingTime);

	        boolean isStartInMorning = startTime.isBefore(closingTime);  
	        boolean isEndInMorning = endTime.isBefore(closingTime) || endTime.equals(closingTime);

	       
	        isValidReservation = 
	            (isStartInEvening && isEndInEvening) || // 21:00 - 23:30
	            (isStartInMorning && isEndInMorning);   // 00:30 - 01:30
	    }

	    if (!isValidReservation) {
	        throw new RuntimeException("Reservation time must be within shop's opening hours.");
	    }


	    //kapasite
	    List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(
	            shop.getId(),
	            reservationRequest.getReservationDate(),
	            startTime,
	            endTime
	    );

	    int currentTotalBags = overlappingReservations.stream()
	            .mapToInt(Reservation::getBagCount)
	            .sum();

	    if (currentTotalBags + reservationRequest.getBagCount() > shop.getCapacity()) {
	        throw new RuntimeException("There is no capacity in this store during this time period.");
	    }

	   
	    int reservationNumber = createReservationNumber();

	    Reservation newReservation = new Reservation();
	    newReservation.setReservationNumber(reservationNumber);
	    newReservation.setBagCount(reservationRequest.getBagCount());
	    newReservation.setReservationDate(reservationRequest.getReservationDate());
	    newReservation.setStartTime(startTime);
	    newReservation.setEndTime(endTime);
	    newReservation.setShop(shop);
	    newReservation.setTraveller(traveller);
	    newReservation.setStatus(ReservationStatus.ACTIVE);

	    reservationRepository.save(newReservation);
	}



	
	public Integer createReservationNumber() {
		
		Random random = new Random();
		int reservationNumber;
		
		do {
			 reservationNumber = 1000000 + random.nextInt(9000000); 
	    } while (reservationRepository.existsByReservationNumber(reservationNumber));
		
		return reservationNumber;
	}
		
	
	public List<ReservationResponseDto> findAllReservationsOfTraveler(String email){
		User traveller = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Traveller not found"));
		
		return reservationRepository.findAllByTraveller(traveller)
	            .stream()
	            .map(ReservationResponseDto::new)
	            .collect(Collectors.toList());
	}
	

	public List<ReservationResponseDto> findAllReservationsOfShopOwner(String email) {
		User shopOwner = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Shop Owner not found"));

		List<Shop> shops = shopRepository.findAllShopsByShopOwner(shopOwner);

		List<Reservation> allReservations = shops.stream()
				.flatMap(shop -> reservationRepository.findAllByShop(shop).stream())
				.collect(Collectors.toList());

		return allReservations.stream()
				.map(ReservationResponseDto::new)
				.collect(Collectors.toList());
	}
	
	// https://www.baeldung.com/spring-scheduled-tasks
	// https://medium.com/@alxkm/mastering-task-scheduling-in-spring-boot-a-comprehensive-guide-to-scheduled-with-asyc-761bb6193fc6
	// https://www.geeksforgeeks.org/spring-boot-scheduling/
	// https://www.youtube.com/watch?v=YJp6Wgav7S4
	
	//saniye-dakika-saat-gün-ay-haftagünü
	@Scheduled(cron = "0 * * * * *") // herdakika rezervasyon taraması yapar
    public void expireOldReservations() {
        List<Reservation> activeReservations = reservationRepository.findAllByStatus(ReservationStatus.ACTIVE);

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        for (Reservation reservation : activeReservations) {
            LocalDate resDate = reservation.getReservationDate();
            LocalTime resEndTime = reservation.getEndTime();

            if ((resDate.isBefore(today)) || (resDate.isEqual(today) && resEndTime.isBefore(now))) {
                reservation.setStatus(ReservationStatus.EXPIRED);
                reservationRepository.save(reservation);
            }
        }
    }
	
	public void cancelReservation(Integer reservationNumber) {
        Reservation reservation = reservationRepository.findByReservationNumber(reservationNumber)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        if (reservation.getStatus() != ReservationStatus.CANCELED) {
            reservation.setStatus(ReservationStatus.CANCELED);
            reservationRepository.save(reservation);
        }
    }
	
	
}
