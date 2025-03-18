package com.example.store.exceptions;

public class BrandNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1;

    public BrandNotFoundException(String message) {
        super(message);
    }
}
