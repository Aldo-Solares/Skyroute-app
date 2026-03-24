package com.skyroute.backend.records;

public record UserRequestRecord(String originalUsername, String username, String password, String role) {
}