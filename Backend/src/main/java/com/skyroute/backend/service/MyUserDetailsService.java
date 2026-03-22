package com.skyroute.backend.service;

import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.skyroute.backend.exceptions.ElementNotFoundException;
import com.skyroute.backend.model.Users;
import com.skyroute.backend.repository.UserRepo;

import java.util.List;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private final UserRepo userRepository;

    public MyUserDetailsService(UserRepo userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws ElementNotFoundException {

        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ElementNotFoundException("User not found: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(user.getRole())));
    }
}