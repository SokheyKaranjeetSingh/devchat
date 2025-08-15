package com.devchat.backend.exception;

public class ThreadNotFoundException extends RuntimeException {
    public ThreadNotFoundException(String message) {
        super(message);
    }
}
