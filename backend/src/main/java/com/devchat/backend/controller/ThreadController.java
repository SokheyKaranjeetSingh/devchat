package com.devchat.backend.controller;

import com.devchat.backend.dto.ThreadRequestDto;
import com.devchat.backend.dto.ThreadResponseDto;
import com.devchat.backend.service.ThreadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/threads")
public class ThreadController {

    @Autowired
    private ThreadService threadService;

    @PostMapping
    public ResponseEntity<ThreadResponseDto> createThread(@RequestBody ThreadRequestDto dto) {
        return ResponseEntity.ok(threadService.createThread(dto));
    }

    @GetMapping
    public ResponseEntity<List<ThreadResponseDto>> getAllThreads() {
        return ResponseEntity.ok(threadService.getAllThreads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThreadResponseDto> getThreadById(@PathVariable Long id) {
        return ResponseEntity.ok(threadService.getThreadById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ThreadResponseDto>> searchThreads(@RequestParam String keyword) {
        return ResponseEntity.ok(threadService.searchThreads(keyword));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ThreadResponseDto> updateThread(@PathVariable Long id, @RequestBody ThreadRequestDto dto) {
        return ResponseEntity.ok(threadService.updateThread(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteThread(@PathVariable Long id) {
        return ResponseEntity.ok(threadService.deleteThread(id));
    }
}