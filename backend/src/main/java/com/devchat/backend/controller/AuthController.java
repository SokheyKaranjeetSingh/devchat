package com.devchat.backend.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.devchat.backend.dto.UserRequestDto;
import com.devchat.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody UserRequestDto userDto) {
        return authService.register(userDto);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        return authService.login(request.get("username"), request.get("password"));
    }
}