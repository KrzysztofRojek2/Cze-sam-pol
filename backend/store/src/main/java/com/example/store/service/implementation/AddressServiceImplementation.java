package com.example.store.service.implementation;

import com.example.store.dto.AddressDto;
import com.example.store.models.Address;
import com.example.store.models.UserEntity;
import com.example.store.repository.AddressRepository;
import com.example.store.repository.UserRepository;
import com.example.store.service.AddressService;
import org.springframework.stereotype.Service;

@Service
public class AddressServiceImplementation implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImplementation(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AddressDto getAddressByUserId(Long userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Address address = user.getAddress();
        return mapToDto(address);
    }

    @Override
    public AddressDto updateAddress(AddressDto addressDto, Long userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Address address = user.getAddress();
        address.setCountry(addressDto.getCountry());
        address.setPostalCode(addressDto.getPostalCode());
        address.setStreet(addressDto.getStreet());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setApartmentNumber(addressDto.getApartmentNumber());
        addressRepository.save(address);
        return mapToDto(address);
    }

    private AddressDto mapToDto(Address address) {
        AddressDto addressDto = new AddressDto();
        addressDto.setId(address.getId());
        addressDto.setCountry(address.getCountry());
        addressDto.setPostalCode(address.getPostalCode());
        addressDto.setStreet(address.getStreet());
        addressDto.setCity(address.getCity());
        addressDto.setState(address.getState());
        addressDto.setApartmentNumber(address.getApartmentNumber());
        return addressDto;
    }
}
