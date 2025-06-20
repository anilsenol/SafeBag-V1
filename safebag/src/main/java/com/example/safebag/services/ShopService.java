package com.example.safebag.services;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.safebag.dtos.ReservationResponseDto;
import com.example.safebag.dtos.ShopDto;
import com.example.safebag.dtos.ShopRequest;
import com.example.safebag.entities.ReservationStatus;
import com.example.safebag.entities.Shop;
import com.example.safebag.entities.ShopStatus;
import com.example.safebag.entities.User;
import com.example.safebag.repositories.IReservationRepository;
import com.example.safebag.repositories.IShopRepository;
import com.example.safebag.repositories.IUserRepository;

import jakarta.transaction.Transactional;

@Service
public class ShopService {

	@Autowired
	private IShopRepository shopRepository;
	@Autowired
	private IUserRepository userRepository;
	@Autowired
	private IReservationRepository reservationRepository;
	
	
	public void createShopRequest(ShopRequest shopRequest, String email) {
		
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		
		Shop newShop = new Shop();
		newShop.setName(shopRequest.getName());
		newShop.setCountry(shopRequest.getCountry());
		newShop.setCity(shopRequest.getCity().toUpperCase(new Locale("tr", "TR")));
		newShop.setOpeningHour(shopRequest.getOpenHour());
		newShop.setClosingHour(shopRequest.getCloseHour());
		newShop.setCapacity(shopRequest.getCapacity());
		newShop.setClosedDay(shopRequest.getClosedDay());
		newShop.setAddress(shopRequest.getAddress());
		newShop.setLatitude(shopRequest.getLatitude());
		newShop.setLongitude(shopRequest.getLongitude());
		newShop.setAddressDescription(shopRequest.getAddressDescription());

		newShop.setShopOwner(user);
		newShop.setStatus(ShopStatus.PENDING); // varsayılan olarak pending statusu alır.
		
		 shopRepository.save(newShop);
	} 
	
	public void updateShopRequest(Integer shopId, ShopRequest shopRequest) {
	   
	    Shop existingShop = shopRepository.findById(shopId)
	            .orElseThrow(() -> new RuntimeException("Shop not found"));

	
	    existingShop.setName(shopRequest.getName());
	    existingShop.setCountry(shopRequest.getCountry());
	    existingShop.setCity(shopRequest.getCity().toUpperCase(new Locale("tr", "TR")));
	    existingShop.setOpeningHour(shopRequest.getOpenHour());
	    existingShop.setClosingHour(shopRequest.getCloseHour());
	    existingShop.setCapacity(shopRequest.getCapacity());
	    existingShop.setClosedDay(shopRequest.getClosedDay());
	    existingShop.setAddress(shopRequest.getAddress());
	    existingShop.setLatitude(shopRequest.getLatitude());
	    existingShop.setLongitude(shopRequest.getLongitude());
	    existingShop.setAddressDescription(shopRequest.getAddressDescription());
	    existingShop.setStatus(ShopStatus.PENDING);

	    shopRepository.save(existingShop);
	}
	
	public List<Shop> listShopsByShopOwner(String email){
		 User shopOwner = userRepository.findByEmail(email)
	                .orElseThrow(() -> new RuntimeException("User not found"));
	        
	        return shopRepository.findAllShopsByShopOwner(shopOwner);
	}
	
	public List<ReservationResponseDto> getReservations(Integer shop_id){
		 return reservationRepository.findAllByShopIdAndStatus(shop_id, ReservationStatus.ACTIVE)
		            .stream()
		            .map(ReservationResponseDto::new)
		            .collect(Collectors.toList());
	}
	
	public ShopDto getShopById(Integer shop_id) {
		Shop shop = shopRepository.findById(shop_id)
	            .orElseThrow(() -> new RuntimeException("Shop not found"));
		
		ShopDto dto = new ShopDto();
		dto.setName(shop.getName());
		dto.setCapacity(shop.getCapacity());
		dto.setCity(shop.getCity());
		dto.setClosingHour(shop.getClosingHour());
		dto.setOpeningHour(shop.getOpeningHour());
		dto.setCountry(shop.getCountry());
		dto.setAddress(shop.getAddress());
		dto.setAddressDescription(shop.getAddressDescription());
		dto.setLatitude(shop.getLatitude());
        dto.setLongitude(shop.getLongitude());
		dto.setOwnerEmail(shop.getShopOwner().getEmail());
		dto.setStatus(shop.getStatus());
		
		return dto;
				
	}
	
	@Transactional // ?
	public void deleteShop(Integer shop_id) {
		Shop shop = shopRepository.findById(shop_id)
		        .orElseThrow(() -> new RuntimeException("Shop not found"));

		if (reservationRepository.existsByShopIdAndStatus(shop_id, ReservationStatus.ACTIVE)) {
		        throw new IllegalStateException("Cannot delete shop: active reservations exist.");
		    }

		    reservationRepository.deleteAllByShopIdAndStatusNot(shop_id, ReservationStatus.ACTIVE);

		    shopRepository.delete(shop);
	}
	

	
}
