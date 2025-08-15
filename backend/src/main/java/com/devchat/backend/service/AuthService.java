package com.devchat.backend.service;

import com.devchat.backend.dto.UserRequestDto;
import java.util.Map;

public interface AuthService {
    Map<String, Object> register(UserRequestDto userDto);
    Map<String, Object> login(String username, String password);
}