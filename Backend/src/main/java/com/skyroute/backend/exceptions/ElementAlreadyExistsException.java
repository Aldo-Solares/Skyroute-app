package com.skyroute.backend.exceptions;

public class ElementAlreadyExistsException extends RuntimeException{
	public ElementAlreadyExistsException(String message) {
		super(message);
	}
}
