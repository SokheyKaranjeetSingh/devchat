package com.devchat.backend.controller;

import com.devchat.backend.dto.MessageRequestDto;
import com.devchat.backend.dto.MessageResponseDto;
import com.devchat.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponseDto> postMessage(@RequestBody MessageRequestDto dto) {
        return ResponseEntity.ok(messageService.postMessage(dto));
    }

    @GetMapping("/thread/{threadId}")
    public ResponseEntity<List<MessageResponseDto>> getMessagesByThread(@PathVariable Long threadId) {
        return ResponseEntity.ok(messageService.getMessagesByThread(threadId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MessageResponseDto> updateMessage(@PathVariable Long id, @RequestBody MessageRequestDto dto) {
        return ResponseEntity.ok(messageService.updateMessage(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMessage(@PathVariable Long id) {
        return ResponseEntity.ok(messageService.deleteMessage(id));
    }
}