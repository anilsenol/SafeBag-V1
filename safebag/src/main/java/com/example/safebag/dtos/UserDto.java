package com.example.safebag.dtos;

import java.util.UUID;

import com.example.safebag.entities.Role;
import com.example.safebag.entities.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter@Setter
@NoArgsConstructor@AllArgsConstructor
public class UserDto {

	private UUID publicId;
	private String firstName;
    private String lastName;
    private String email;
    private String taxNumber;
    private Role role;
    
    public UserDto(User user) {
    	this.publicId = user.getPublicId(); // id gizlemek için
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.taxNumber = user.getTaxNumber();
        this.role = user.getRole();
    }
    
}
