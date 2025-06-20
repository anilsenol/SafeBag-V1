package com.example.safebag.repositories;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.safebag.entities.Reservation;
import com.example.safebag.entities.ReservationStatus;
import com.example.safebag.entities.Shop;
import com.example.safebag.entities.User;

@Repository
public interface IReservationRepository extends JpaRepository<Reservation, Integer>{
	

	List<Reservation> findAllByTraveller(User traveller);
	List<Reservation> findAllByShop(Shop shop);
	List<Reservation> findAllByStatus(ReservationStatus status);
	List<Reservation> findAllByShopIdAndStatus(int shopId, ReservationStatus status);
	
	boolean existsByReservationNumber(int reservationNumber);
	 Optional<Reservation> findByReservationNumber(Integer reservationNumber);
	 
	 List<Reservation> findByShopIdAndStatus(Integer shopId, ReservationStatus status);
	 List<Reservation> findByShopId(Integer shopId);
	 List<Reservation> findByTravellerIdAndStatus(Integer travellerId, ReservationStatus status);

	 
	 
	// Query Stackoverflow üzerinden alındı.
	@Query("SELECT s FROM Reservation s WHERE s.shop.id = :shopId AND s.reservationDate = :date AND ((s.startTime < :endTime AND s.endTime > :startTime))")
	List<Reservation> findOverlappingReservations(@Param("shopId") int shopId,
	                                              @Param("date") LocalDate date,
	                                              @Param("startTime") LocalTime startTime,
	                                              @Param("endTime") LocalTime endTime);
	
	boolean existsByShopIdAndStatus(Integer shopId, ReservationStatus status);
	
	void deleteAllByShopIdAndStatusNot(Integer shopId, ReservationStatus status);
	void deleteAllByTravellerId(Integer travellerId);
	
	
}
