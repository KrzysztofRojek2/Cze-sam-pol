package com.example.store.service.implementation;

import com.example.store.dto.UserDto;
import com.example.store.models.Role;
import com.example.store.models.UserEntity;
import com.example.store.repository.UserRepository;
import com.example.store.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;

    public UserServiceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDto getUserById(Long id) {
        UserEntity user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    @Override
    public UserDto updateUser(UserDto userDto, Long id) {
        UserEntity user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        user.setPhoneNumber(userDto.getPhoneNumber());
        userRepository.save(user);
        return mapToDto(user);
    }

    public Long getUserIdByUsername(String username) {
        UserEntity user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Username not found"));
        return user.getId();
    }

    @Override
    public UserDto banUser(Long id) {
        UserEntity user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBanned(true);
        userRepository.save(user);
        return mapToDto(user);
    }

    @Override
    public UserDto unbanUser(Long id) {
        UserEntity user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBanned(false);
        userRepository.save(user);
        return mapToDto(user);
    }

    @Override
    public Integer getUsersCount() {

        List<UserEntity> users = userRepository.findAll();
        return users.size();
    }

    @Override
    public Integer getUserRoles(Long userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<Integer> roleIds = user.getRoles().stream()
                .map(Role::getId)
                .collect(Collectors.toList());
        int userRoleId = roleIds.get(0);

        System.out.println("User role ID for userId " + userId + ": " + userRoleId);

        return userRoleId;
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<UserEntity> users = userRepository.findAll();
        List<UserDto> userDtos = users.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return userDtos;
    }

    private UserDto mapToDto(UserEntity user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setPassword(user.getPassword());
        userDto.setIsBanned(user.getIsBanned());
        return userDto;
    }
}
