package com.devchat.backend.service;

import com.devchat.backend.dto.ThreadRequestDto;
import com.devchat.backend.dto.ThreadResponseDto;
import com.devchat.backend.entity.Thread;
import com.devchat.backend.entity.User;
import com.devchat.backend.exception.ThreadNotFoundException;
import com.devchat.backend.repository.ThreadRepository;
import com.devchat.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThreadServiceImpl implements ThreadService {

    @Autowired
    private ThreadRepository threadRepo;

    @Autowired
    private UserRepository userRepo;

    @Override
    public ThreadResponseDto createThread(ThreadRequestDto dto) {
        String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepo.findByUsername(loggedInUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Thread thread = new Thread();
        thread.setTitle(dto.getTitle());
        thread.setContent(dto.getContent());
        thread.setAuthor(user);
        thread.setCreatedAt(LocalDateTime.now());

        return mapToDto(threadRepo.save(thread));
    }

    @Override
    public ThreadResponseDto updateThread(Long threadId, ThreadRequestDto dto) {
        String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        Thread thread = threadRepo.findById(threadId)
                .orElseThrow(() -> new ThreadNotFoundException("Thread not found"));

        // Check if the current user is the author of the thread
        if (!thread.getAuthor().getUsername().equals(loggedInUsername)) {
            throw new RuntimeException("Access denied: You can only edit your own threads");
        }

        thread.setTitle(dto.getTitle());
        thread.setContent(dto.getContent());

        return mapToDto(threadRepo.save(thread));
    }

    @Override
    public String deleteThread(Long threadId) {
        String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        Thread thread = threadRepo.findById(threadId)
                .orElseThrow(() -> new ThreadNotFoundException("Thread not found"));

        // Check if the current user is the author of the thread
        if (!thread.getAuthor().getUsername().equals(loggedInUsername)) {
            throw new RuntimeException("Access denied: You can only delete your own threads");
        }

        threadRepo.delete(thread);
        return "Thread deleted successfully";
    }

    public String getLoggedInUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @Override
    public List<ThreadResponseDto> getAllThreads() {
        return threadRepo.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ThreadResponseDto getThreadById(Long id) {
        Thread thread = threadRepo.findById(id)
                .orElseThrow(() -> new ThreadNotFoundException("Thread not found"));
        return mapToDto(thread);
    }

    @Override
    public List<ThreadResponseDto> searchThreads(String keyword) {
        return threadRepo.searchByKeyword(keyword)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ThreadResponseDto mapToDto(Thread thread) {
        ThreadResponseDto dto = new ThreadResponseDto();
        dto.setId(thread.getId());
        dto.setTitle(thread.getTitle());
        dto.setContent(thread.getContent());
        dto.setAuthor(thread.getAuthor().getUsername());
        dto.setCreatedAt(thread.getCreatedAt());
        return dto;
    }
}