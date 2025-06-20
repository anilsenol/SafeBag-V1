package com.example.safebag.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.safebag.dtos.ReservationResponseDto;
import com.example.safebag.dtos.ShopDto;
import com.example.safebag.dtos.UserDto;
import com.example.safebag.entities.Reservation;
import com.example.safebag.entities.ReservationStatus;
import com.example.safebag.entities.Role;
import com.example.safebag.entities.Shop;
import com.example.safebag.entities.ShopStatus;
import com.example.safebag.entities.User;
import com.example.safebag.repositories.IReservationRepository;
import com.example.safebag.repositories.IShopRepository;
import com.example.safebag.repositories.IUserRepository;

@Service
public class AdminService {

	@Autowired
	private IUserRepository userRepository;
	@Autowired
	private IShopRepository shopRepository;
	@Autowired
	private IReservationRepository reservationRepository;
	
	
	public void approveShop(Integer shop_id) {
		Shop shop = shopRepository.findById(shop_id)
				.orElseThrow(() -> new RuntimeException("Shop not found"));
		
		shop.setStatus(ShopStatus.ACTIVE);
		shopRepository.save(shop);
	}
	
	public void rejectShop(Integer shop_id) {
		Shop shop = shopRepository.findById(shop_id)
				.orElseThrow(() -> new RuntimeException("Shop not found"));
		
		shop.setStatus(ShopStatus.REJECTED);
		shopRepository.save(shop);
	}
	
	public List<ShopDto> getAllPendingShops(){
		return shopRepository.findAllByStatus(ShopStatus.PENDING)
	            .stream()
	            .map(ShopDto::new)
	            .collect(Collectors.toList());
	}
	
	
	public List<UserDto> getAllUsers() {
	    return userRepository.findAll()
	            .stream()
	            .filter(user -> !user.getRole().equals(Role.ADMIN))
	            .map(UserDto::new)
	            .collect(Collectors.toList());
	}
	
	public List<ShopDto> getAllShops(){
		return shopRepository.findAll()
				.stream()
				.map(ShopDto::new)
				.collect(Collectors.toList());
	}
	
	public List<ReservationResponseDto> getAllReservations(){
		 return reservationRepository.findAll()
		            .stream()
		            .map(ReservationResponseDto::new)
		            .collect(Collectors.toList()); 
	}
	
	public List<ReservationResponseDto> getTravelerReservations(UUID publicId) {
        User user = userRepository.findByPublicId(publicId);
        if (user == null || user.getRole() != Role.TRAVELER) {
            throw new IllegalArgumentException("User not found or not a traveler");
        }

        List<Reservation> reservations = reservationRepository.findAllByTraveller(user);
        return reservations.stream()
            .map(ReservationResponseDto::new)
            .collect(Collectors.toList());
    }
	
	public List<ShopDto> getShopsByShopOwner(UUID publicId) {
	    User user = userRepository.findByPublicId(publicId);
	    if (user == null || user.getRole() != Role.SHOPOWNER) {
	        throw new IllegalArgumentException("User not found or not a shop owner");
	    }

	    List<Shop> shopList = shopRepository.findAllShopsByShopOwner(user);
	    return shopList.stream()
	        .map(ShopDto::new)
	        .collect(Collectors.toList());
	}
	
	public List<ReservationResponseDto> getReservationsByShop(int shopId) {
	    Shop shop = shopRepository.findById(shopId)
	        .orElseThrow(() -> new IllegalArgumentException("Shop not found"));

	    List<Reservation> reservations = reservationRepository.findAllByShop(shop);
	    return reservations.stream()
	        .map(ReservationResponseDto::new)
	        .collect(Collectors.toList());
	}
	
	public void deleteShop(Integer shop_id) {
		List<Reservation> activeReservations =
		        reservationRepository.findByShopIdAndStatus(shop_id, ReservationStatus.ACTIVE);

		    if (!activeReservations.isEmpty()) {
		        throw new RuntimeException("Shop cannot be deleted because it has active reservations.");
		    }

		    List<Reservation> otherReservations =
		        reservationRepository.findByShopId(shop_id)
		            .stream()
		            .filter(r -> !r.getStatus().equals(ReservationStatus.ACTIVE))
		            .collect(Collectors.toList());
		    // active olmayan rezervasyonları sil
		    reservationRepository.deleteAll(otherReservations);
		    shopRepository.deleteById(shop_id);
	}
	
	public void deleteUser(Integer user_id) {
	    User user = userRepository.findById(user_id)
	        .orElseThrow(() -> new RuntimeException("User not found"));

	    // traveler  aktif rezervasyon 
	    if (user.getRole().name().equals("TRAVELER")) {
	        List<Reservation> activeReservations = reservationRepository.findByTravellerIdAndStatus(user_id, ReservationStatus.ACTIVE);
	        if (!activeReservations.isEmpty()) {
	            throw new RuntimeException("Traveler cannot be deleted because they have active reservations.");
	        }
	    }

	    // shopowner  aktif rezervasyon 
	    if (user.getRole().name().equals("SHOPOWNER")) {
	        List<Shop> shops = shopRepository.findByShopOwner_Id(user_id);

	        for (Shop shop : shops) {
	            List<Reservation> shopActiveReservations = reservationRepository.findByShopIdAndStatus(shop.getId(), ReservationStatus.ACTIVE);
	            if (!shopActiveReservations.isEmpty()) {
	                throw new RuntimeException("Shop owner cannot be deleted because one or more shops have active reservations.");
	            }
	        }
	        for (Shop shop : shops) {
	            reservationRepository.deleteAll(reservationRepository.findAllByShop(shop)); 
	            shopRepository.deleteById(shop.getId());
	        }
	    }

	  
	    userRepository.deleteById(user_id);
	}

}
