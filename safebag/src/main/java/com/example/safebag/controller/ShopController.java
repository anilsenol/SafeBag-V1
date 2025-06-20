package com.example.safebag.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.safebag.dtos.ShopDto;
import com.example.safebag.dtos.ShopRequest;
import com.example.safebag.entities.Shop;
import com.example.safebag.services.ShopService;

@RestController
@RequestMapping("/api/shops")
public class ShopController {

	@Autowired
	private ShopService shopService;
	
	 @PostMapping("/create")
	    public String String (@RequestBody ShopRequest request, 
	                                             @AuthenticationPrincipal UserDetails userDetails) {
		 
	        String email = userDetails.getUsername();
	        shopService.createShopRequest(request, email);
	        return ("Shop created and waiting for approval.");
	    }
	 
	 @PutMapping("/{id}")
	 public ResponseEntity<Void> updateShop(
	         @PathVariable("id") Integer id,
	         @RequestBody ShopRequest shopRequest
	        ) {
	     shopService.updateShopRequest(id, shopRequest);

	     return ResponseEntity.ok().build();
	 }
	 
	 
	 @GetMapping("/myshops")
	 public List<Shop> listShopsOfShopOwners(@AuthenticationPrincipal UserDetails userDetails){
		 String email = userDetails.getUsername();
		 return shopService.listShopsByShopOwner(email);
	 }
	 
	
	 

	 
	 @GetMapping("/myshops/{id}")
	 public ShopDto getShopById(@PathVariable("id") Integer id) {
		 return shopService.getShopById(id);
	 }
	 
	 @DeleteMapping("/myshops/{id}/delete")
	 public void deleteShop(@PathVariable("id") Integer shop_id) {
		 shopService.deleteShop(shop_id);
	 }
	 
	
}
