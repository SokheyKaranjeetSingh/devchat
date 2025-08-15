package com.devchat.backend.controller;

import com.devchat.backend.dto.VoteRequestDto;
import com.devchat.backend.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    @Autowired
    private VoteService voteService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Map<String, Object> vote(@RequestBody VoteRequestDto dto) {
        return voteService.vote(dto);
    }

    @GetMapping("/message/{messageId}")
    public Map<String, Integer> getVoteCounts(@PathVariable Long messageId) {
        return voteService.getVoteCounts(messageId);
    }
}