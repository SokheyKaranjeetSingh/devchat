package com.devchat.backend.service;

import com.devchat.backend.dto.ThreadRequestDto;
import com.devchat.backend.dto.ThreadResponseDto;

import java.util.List;

public interface ThreadService {
    ThreadResponseDto createThread(ThreadRequestDto dto);
    List<ThreadResponseDto> getAllThreads();
    ThreadResponseDto getThreadById(Long id);
    List<ThreadResponseDto> searchThreads(String keyword);
    ThreadResponseDto updateThread(Long threadId, ThreadRequestDto dto);
    String deleteThread(Long threadId);
}