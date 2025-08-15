package com.devchat.backend.service;

import com.devchat.backend.dto.UserResponseDto;
import com.devchat.backend.entity.User;
import com.devchat.backend.enums.Role;
import com.devchat.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserResponseDto> getPendingUsers() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        List<User> pendingUsers;

        if (currentUser.getRole() == Role.SUPERADMIN) {
            // Superadmin can see all pending users
            pendingUsers = userRepository.findByVerifiedFalse();
        } else if (currentUser.getRole() == Role.ADMIN) {
            // Admin can only see pending DEV users
            pendingUsers = userRepository.findByRoleAndVerifiedFalse(Role.DEV);
        } else {
            throw new RuntimeException("Access denied");
        }

        return pendingUsers.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public String verifyUser(Long userId) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        User userToVerify = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check permissions
        if (currentUser.getRole() == Role.SUPERADMIN) {
            // Superadmin can verify anyone
        } else if (currentUser.getRole() == Role.ADMIN && userToVerify.getRole() == Role.DEV) {
            // Admin can only verify DEV users
        } else {
            throw new RuntimeException("Access denied");
        }

        userToVerify.setVerified(true);
        userRepository.save(userToVerify);

        return "User verified successfully";
    }

    @Override
    public List<UserResponseDto> getAllUsersForAdmin() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private UserResponseDto mapToDto(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setVerified(user.isVerified());
        return dto;
    }
}