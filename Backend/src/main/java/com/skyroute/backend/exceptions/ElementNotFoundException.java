package com.skyroute.backend.exceptions;

public class ElementNotFoundException extends RuntimeException{
	public ElementNotFoundException(String message) {
		super(message);
	}
}
