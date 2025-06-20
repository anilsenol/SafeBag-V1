package com.example.safebag.dtos;

import java.time.LocalTime;

import com.example.safebag.entities.ShopStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@NoArgsConstructor@AllArgsConstructor
public class ShopRequest {

	private String name;
    private String country;
    private String city;
    private LocalTime openHour;
    private LocalTime closeHour;
    private int capacity;
    private String closedDay;
    private String address;
    private String addressDescription;
    private double latitude;
    private double longitude;
    private ShopStatus status;
    
    
}
