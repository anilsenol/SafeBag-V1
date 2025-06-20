package com.example.safebag.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.safebag.dtos.ResetPasswordDto;
import com.example.safebag.dtos.ShopDto;
import com.example.safebag.services.UserService;

@RestController
@RequestMapping("/api/user/")
public class UserController {

	@Autowired
	private UserService userService;
	
	@GetMapping("/getshopsbycity")
	 public List<ShopDto> getShopsByCity(@RequestParam String city) {
	     return userService.getShopByCityName(city);
	 }
	

}
