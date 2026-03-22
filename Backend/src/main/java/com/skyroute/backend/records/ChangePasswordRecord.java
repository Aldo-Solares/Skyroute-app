package com.skyroute.backend.records;

public record ChangePasswordRecord(
        String username,
        String oldPassword,
        String newPassword) {
}