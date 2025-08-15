package com.devchat.backend.service;

import com.devchat.backend.dto.VoteRequestDto;
import java.util.Map;

public interface VoteService {
    Map<String, Object> vote(VoteRequestDto dto);
    Map<String, Integer> getVoteCounts(Long messageId);
}