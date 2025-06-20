package com.example.safebag.controller;

import com.example.safebag.dtos.JwtResponse;
import com.example.safebag.dtos.ResetPasswordDto;
import com.example.safebag.dtos.UserLogin;
import com.example.safebag.dtos.UserRegister;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.safebag.services.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthService authService;
	

	
	@PostMapping("/register")
    public ResponseEntity<JwtResponse> register(@RequestBody UserRegister request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody UserLogin request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
	@PutMapping("/reset-password")
	public String resetPassword(@RequestBody ResetPasswordDto resetPassword){
		return authService.resetPassword(resetPassword.getEmail(), resetPassword.getNewPassword());
	}
    
    
    
}
