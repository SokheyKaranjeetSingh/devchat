package com.devchat.backend.controller;

import com.devchat.backend.dto.UserResponseDto;
import com.devchat.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/pending-users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public List<UserResponseDto> getPendingUsers() {
        return adminService.getPendingUsers();
    }

    @PostMapping("/verify-user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERADMIN')")
    public String verifyUser(@PathVariable Long userId) {
        return adminService.verifyUser(userId);
    }

    @GetMapping("/all-users")
    @PreAuthorize("hasRole('SUPERADMIN')")
    public List<UserResponseDto> getAllUsers() {
        return adminService.getAllUsersForAdmin();
    }
}