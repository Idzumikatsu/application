package com.crm.system.exception;

public class UserNotFoundException extends NotFoundException {
    public UserNotFoundException(String message) {
        super(message);
    }

    public UserNotFoundException(Long id) {
        super("User not found with id: " + id);
    }
}