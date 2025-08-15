package com.devchat.backend.service;

import com.devchat.backend.dto.MessageRequestDto;
import com.devchat.backend.dto.MessageResponseDto;
import com.devchat.backend.entity.Message;
import com.devchat.backend.entity.Thread;
import com.devchat.backend.entity.User;
import com.devchat.backend.enums.Role;
import com.devchat.backend.repository.MessageRepository;
import com.devchat.backend.repository.ThreadRepository;
import com.devchat.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ThreadRepository threadRepo;

    @Override
    public MessageResponseDto postMessage(MessageRequestDto dto) {
        String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        User sender = userRepo.findByUsername(loggedInUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (sender.getRole() != Role.DEV) {
            throw new RuntimeException("Only DEV users can reply to threads");
        }

        Thread thread = threadRepo.findById(dto.getThreadId())
                .orElseThrow(() -> new RuntimeException("Thread not found"));

        Message msg = new Message();
        msg.setSender(sender);
        msg.setThread(thread);
        msg.setContent(dto.getContent());
        msg.setTimestamp(LocalDateTime.now());

        return mapToDto(messageRepo.save(msg));
    }

    @Override
    public MessageResponseDto updateMessage(Long messageId, MessageRequestDto dto) {
        String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        Message message = messageRepo.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Check if the current user is the sender of the message
        if (!message.getSender().getUsername().equals(loggedInUsername)) {
            throw new RuntimeException("Access denied: You can only edit your own messages");
        }

        message.setContent(dto.getContent());

        return mapToDto(messageRepo.save(message));
    }

    @Override
    public String deleteMessage(Long messageId) {
        String loggedInUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        Message message = messageRepo.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Check if the current user is the sender of the message
        if (!message.getSender().getUsername().equals(loggedInUsername)) {
            throw new RuntimeException("Access denied: You can only delete your own messages");
        }

        messageRepo.delete(message);
        return "Message deleted successfully";
    }

    @Override
    public List<MessageResponseDto> getMessagesByThread(Long threadId) {
        return messageRepo.findByThreadId(threadId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private MessageResponseDto mapToDto(Message msg) {
        MessageResponseDto dto = new MessageResponseDto();
        dto.setId(msg.getId());
        dto.setContent(msg.getContent());
        dto.setSenderUsername(msg.getSender().getUsername());
        dto.setThreadId(msg.getThread().getId());
        dto.setTimestamp(msg.getTimestamp());
        dto.setUpvotes(msg.getUpvotes());
        dto.setDownvotes(msg.getDownvotes());
        return dto;
    }
}