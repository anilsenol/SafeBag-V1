package com.example.safebag.services;

import com.example.safebag.entities.Role;
import com.example.safebag.entities.User;
import com.example.safebag.dtos.JwtResponse;
import com.example.safebag.dtos.UserLogin;
import com.example.safebag.dtos.UserRegister;
import com.example.safebag.repositories.IUserRepository;
import com.example.safebag.security.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

	@Autowired
    private final IUserRepository userRepository;
	@Autowired
    private final PasswordEncoder passwordEncoder;
	@Autowired
    private final JwtUtil jwtUtil;
	
	@Autowired
	private UserDetailsService userDetailsService;


	public JwtResponse register(UserRegister request) {
	    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
	        throw new RuntimeException("Email already registered");
	    }

	    if (request.getRole() == Role.SHOPOWNER) {
	        if (request.getTaxNumber() == null || request.getTaxNumber().isBlank()) {
	            throw new RuntimeException("Tax number is required for shop owners");
	        }
	        if (userRepository.findByTaxNumber(request.getTaxNumber()).isPresent()) {
	            throw new RuntimeException("Tax number already in use");
	        }
	    }

	    User user = new User();
	    user.setFirstName(request.getFirstName());
	    user.setLastName(request.getLastName());
	    user.setEmail(request.getEmail());
	    user.setPassword(passwordEncoder.encode(request.getPassword()));

	
	    if (request.getRole() == Role.SHOPOWNER) {
	        user.setTaxNumber(request.getTaxNumber());
	    }

	    user.setRole(request.getRole());
	    userRepository.save(user);

	    UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
	    String token = jwtUtil.generateToken(userDetails);
	    String role = user.getRole().name();

	    return new JwtResponse(token, role);
	}


    public JwtResponse login(UserLogin request) {
    	User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        String role = user.getRole().name();

        return new JwtResponse(token,role);
    }
    
	public String resetPassword(String email, String newPassword) {
		User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
		
		 user.setPassword(passwordEncoder.encode(newPassword));
	        userRepository.save(user);

	        return "Password reset successful";
		
	}
    
}