package com.example.store.service;

import com.example.store.dto.AddressDto;

public interface AddressService {
    AddressDto getAddressByUserId(Long userId);
    AddressDto updateAddress(AddressDto addressDto, Long userId);
}