package com.devchat.backend.service;

import com.devchat.backend.dto.MessageRequestDto;
import com.devchat.backend.dto.MessageResponseDto;

import java.util.List;

public interface MessageService {
    MessageResponseDto postMessage(MessageRequestDto dto);
    List<MessageResponseDto> getMessagesByThread(Long threadId);
    MessageResponseDto updateMessage(Long messageId, MessageRequestDto dto);
    String deleteMessage(Long messageId);
}