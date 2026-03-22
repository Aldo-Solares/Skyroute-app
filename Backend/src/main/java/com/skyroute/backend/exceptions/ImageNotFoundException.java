package com.skyroute.backend.exceptions;

public class ImageNotFoundException extends RuntimeException{
	public ImageNotFoundException(String message) {
		super(message);
	}
}
