package com.example.safebag.services;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.safebag.dtos.ShopDto;
import com.example.safebag.entities.Shop;
import com.example.safebag.entities.ShopStatus;
import com.example.safebag.repositories.IShopRepository;

@Service
public class UserService {
	
	@Autowired
	private IShopRepository shopRepository;
	

	
	
	public List<ShopDto> getShopByCityName(String cityName) {
		List<Shop> shops = shopRepository.findByCityIgnoreCaseAndStatus(cityName.trim(), ShopStatus.ACTIVE);
		
		 return shops.stream().map(shop -> {
		        ShopDto dto = new ShopDto();
		        dto.setId(shop.getId());
		        dto.setName(shop.getName());
		        dto.setCapacity(shop.getCapacity());
		        dto.setCity(shop.getCity());
		        dto.setClosingHour(shop.getClosingHour());
		        dto.setOpeningHour(shop.getOpeningHour());
		        dto.setCountry(shop.getCountry());
		        dto.setAddress(shop.getAddress());
		        dto.setAddressDescription(shop.getAddressDescription());
		        dto.setClosedDay(shop.getClosedDay());
		        dto.setLatitude(shop.getLatitude());
		        dto.setLongitude(shop.getLongitude());
		        dto.setOwnerEmail(shop.getShopOwner().getEmail());
		        dto.setStatus(shop.getStatus());
		        System.out.println("City name received: '" + cityName + "'");

		        return dto;
		    }).collect(Collectors.toList());
		
	}
	
}
