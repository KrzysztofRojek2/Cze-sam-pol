package com.example.store.service.implementation;

import com.example.store.dto.ShippingDto;
import com.example.store.models.Shipping;
import com.example.store.repository.ShippingRepository;
import com.example.store.service.ShippingService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ShippingServiceImplementation implements ShippingService {

    private ShippingRepository shippingRepository;
    public ShippingServiceImplementation( ShippingRepository shippingRepository) {
        this.shippingRepository = shippingRepository;
    }

    @Override
    public List<ShippingDto> getAllShipping() {
        List<Shipping> shippings = shippingRepository.findAll();
        List<ShippingDto> shippingDtos = new ArrayList<>();
        for (Shipping shipping : shippings) {
            shippingDtos.add(mapToDto(shipping));
        }
        return shippingDtos;
    }

    private ShippingDto mapToDto(Shipping shipping) {
        ShippingDto shippingDto = new ShippingDto();
        shippingDto.setId(shipping.getId());
        shippingDto.setName(shipping.getName());
        shippingDto.setPrice(shipping.getPrice());
        return shippingDto;
    }
}
