package com.skyroute.backend.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.skyroute.backend.exceptions.ElementNotFoundException;
import com.skyroute.backend.exceptions.PasswordException;
import com.skyroute.backend.model.Users;
import com.skyroute.backend.records.UserResponseRecord;
import com.skyroute.backend.repository.UserRepo;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private FileService fileService;

	@Override
	public Optional<Users> findByUsername(String username) {
		return userRepo.findByUsername(username);
	}

	@Override
	public Users saveUser(Users user) {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepo.save(user);
	}

	@Override
	public UserResponseRecord updateUser(String userOg, String newUser, MultipartFile img) {

		Optional<Users> userUpdate = userRepo.findByUsername(userOg);

		if (userUpdate.isEmpty()) {
			throw new ElementNotFoundException("User does not exists");
		}

		Users user = userUpdate.get();
		user.setUsername(newUser);

		if (img != null && !img.isEmpty()) {
			String fileName = fileService.uploadSingleImage(img, "users");
			user.setImgPath(fileName);
		}

		userRepo.save(user);

		return new UserResponseRecord(
				user.getUsername(),
				user.getRole(),
				user.getImgPath());
	}

	@Override
	public boolean changePassword(String username, String oldPassword, String newPassword) {

		Optional<Users> userOp = userRepo.findByUsername(username);

		if (userOp.isEmpty()) {
			throw new ElementNotFoundException("User not found");
		}

		Users user = userOp.get();

		if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
			throw new PasswordException("Incorrect current password");
		}

		user.setPassword(passwordEncoder.encode(newPassword));

		userRepo.save(user);

		return true;
	}

	@Override
	public UserResponseRecord getUserInfo(String userName) {

		Optional<Users> userBase = userRepo.findByUsername(userName);

		if (userBase.isEmpty()) {
			throw new ElementNotFoundException("User not found");
		}

		Users user = userBase.get();

		return new UserResponseRecord(
				user.getUsername(),
				user.getRole(),
				user.getImgPath());
	}
}