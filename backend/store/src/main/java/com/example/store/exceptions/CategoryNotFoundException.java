package com.example.store.exceptions;

public class CategoryNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1;

    public CategoryNotFoundException(String message){
        super(message);
    }
}
