package com.example.safebag.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.safebag.entities.User;

public interface IUserRepository extends JpaRepository<User, Integer>{
	Optional<User> findByEmail(String email);
	
	Optional<User> findByTaxNumber(String taxNumber);
	
	User findByPublicId(UUID publicId);
	
	
}
