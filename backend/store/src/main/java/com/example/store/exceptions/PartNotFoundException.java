package com.example.store.exceptions;

public class PartNotFoundException extends RuntimeException{
    private static final long serialVersionUID = 1;

    public PartNotFoundException(String message){
        super(message);
    }
}
