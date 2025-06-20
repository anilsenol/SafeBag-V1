package com.example.safebag.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor@AllArgsConstructor
public class ResetPasswordDto {
	 private String email;
	 private String newPassword;

}
