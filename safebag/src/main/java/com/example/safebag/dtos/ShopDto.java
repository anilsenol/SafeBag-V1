package com.example.safebag.dtos;

import java.time.LocalTime;

import com.example.safebag.entities.Shop;
import com.example.safebag.entities.ShopStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@NoArgsConstructor@AllArgsConstructor
public class ShopDto {

	private int id;
	private String name;
    private String country;
    private String city;
    private String address;
    private String addressDescription;
    private LocalTime openingHour;
    private LocalTime closingHour;
    private String closedDay;
    private int capacity;
    private double latitude;
    private double longitude;
    private ShopStatus status;
    private String ownerEmail;
	
    public ShopDto(Shop shop) {
    	this.id = shop.getId();
        this.name = shop.getName();
        this.country = shop.getCountry();
        this.city = shop.getCity();
        this.address = shop.getAddress();
        this.addressDescription=shop.getAddressDescription();
        this.openingHour = shop.getOpeningHour();
        this.closingHour = shop.getClosingHour();
        this.closedDay = shop.getClosedDay();
        this.capacity = shop.getCapacity();
        this.latitude = shop.getLatitude();
        this.longitude = shop.getLongitude();
        this.status = shop.getStatus();
        this.ownerEmail = shop.getShopOwner() != null ? shop.getShopOwner().getEmail() : null;
    }
	
}
