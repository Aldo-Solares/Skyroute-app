package com.skyroute.backend.exceptions;

public class FileStorageException extends RuntimeException {
    public FileStorageException(String fileName) {
        super("Could not store file: " + fileName);
    }
}