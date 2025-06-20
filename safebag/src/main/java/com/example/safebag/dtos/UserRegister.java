package com.example.safebag.dtos;

import com.example.safebag.entities.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@NoArgsConstructor@AllArgsConstructor
public class UserRegister {
	private String firstName;
	private String lastName;
	private String email;
	private String password;
	private String taxNumber; 
	private Role role;
}
