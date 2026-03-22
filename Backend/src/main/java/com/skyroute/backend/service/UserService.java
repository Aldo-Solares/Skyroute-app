package com.skyroute.backend.service;

import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.skyroute.backend.model.Users;
import com.skyroute.backend.records.UserResponseRecord;

public interface UserService {

	Optional<Users> findByUsername(String username);

	Users saveUser(Users user);

	UserResponseRecord updateUser(String userOg, String newUser, MultipartFile img);

	boolean changePassword(String username, String oldPassword, String newPassword);

	UserResponseRecord getUserInfo(String userName);
}