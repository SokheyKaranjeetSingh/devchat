package com.devchat.backend.controller;

import com.devchat.backend.dto.UserRequestDto;
import com.devchat.backend.dto.UserResponseDto;
import com.devchat.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping("/{username}")
    public UserResponseDto getUser(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }

    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        return userService.getAllUsers();
    }
}
