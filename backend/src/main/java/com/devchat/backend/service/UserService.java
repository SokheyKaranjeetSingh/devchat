package com.devchat.backend.service;

import com.devchat.backend.dto.UserRequestDto;
import com.devchat.backend.dto.UserResponseDto;

import java.util.List;

public interface UserService {
    UserResponseDto createUser(UserRequestDto userDto);
    UserResponseDto getUserByUsername(String username);
    List<UserResponseDto> getAllUsers();
}
