package com.example.safebag.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.safebag.dtos.ReservationResponseDto;
import com.example.safebag.dtos.ShopDto;
import com.example.safebag.dtos.UserDto;
import com.example.safebag.entities.User;
import com.example.safebag.repositories.IUserRepository;
import com.example.safebag.services.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

	@Autowired
	private AdminService adminService;
	
	@Autowired
	private IUserRepository userRepository;
	
	@GetMapping("/users/{publicId}")
	public ResponseEntity<UserDto> getUserByPublicId(@PathVariable UUID publicId) {
	    User user = userRepository.findByPublicId(publicId);

	    if (user != null) {
	        return ResponseEntity.ok(new UserDto(user));
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	
	@GetMapping("/users/{publicId}/shops")
	public ResponseEntity<List<ShopDto>> getShopsByShopOwner(@PathVariable UUID publicId) {
	    List<ShopDto> shops = adminService.getShopsByShopOwner(publicId);
	    return ResponseEntity.ok(shops);
	}
	
	@GetMapping("/shops/{shopId}/reservations")
	public ResponseEntity<List<ReservationResponseDto>> getReservationsByShop(@PathVariable int shopId) {
	    List<ReservationResponseDto> reservations = adminService.getReservationsByShop(shopId);
	    return ResponseEntity.ok(reservations);
	}
	
	
	@GetMapping("/users/all")
	public List<UserDto> getAllUsers(){
		return adminService.getAllUsers();
	}
	
	@GetMapping("/shops/pending")
	public List<ShopDto> getAllPendingShops(){
		return adminService.getAllPendingShops();
	}
	@GetMapping("/shops/all")
	public List<ShopDto> getAllShops(){
		return adminService.getAllShops();
	}
	
	@GetMapping("/reservations")
	public List<ReservationResponseDto> getAllReservations(){
		return adminService.getAllReservations();
	}
	 @GetMapping("/users/{publicId}/reservations")
	    public ResponseEntity<List<ReservationResponseDto>> getTravelerReservations(@PathVariable UUID publicId) {
	        List<ReservationResponseDto> reservations = adminService.getTravelerReservations(publicId);
	        return ResponseEntity.ok(reservations);
	    }
	
	@DeleteMapping("/shops/delete/{shop_id}")
	public void deleteShop(@PathVariable Integer shop_id) {
		adminService.deleteShop(shop_id);
	}
	
	@DeleteMapping("/users/delete/{publicId}")
	public void deleteUser(@PathVariable UUID publicId) {
		User user = userRepository.findByPublicId(publicId);
		int user_id = user.getId();
		adminService.deleteUser(user_id);
	}
	
	
	
	@PutMapping("/shops/{shopId}/approve")
	public ResponseEntity<String> approveShop(@PathVariable Integer shopId) {
	    adminService.approveShop(shopId);
	    return ResponseEntity.ok("Approved!");
	}
	@PutMapping("/shops/{shopId}/reject")
	public ResponseEntity<String> rejectShop(@PathVariable Integer shopId) {
	    adminService.rejectShop(shopId);
	    return ResponseEntity.ok("Rejected!");
	}
	
	
	
}
