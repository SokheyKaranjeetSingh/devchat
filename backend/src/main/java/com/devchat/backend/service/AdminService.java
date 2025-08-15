package com.devchat.backend.service;

import com.devchat.backend.dto.UserResponseDto;
import java.util.List;

public interface AdminService {
    List<UserResponseDto> getPendingUsers();
    String verifyUser(Long userId);
    List<UserResponseDto> getAllUsersForAdmin();
}