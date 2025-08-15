package com.devchat.backend.repository;

import com.devchat.backend.entity.Vote;
import com.devchat.backend.enums.VoteType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserIdAndMessageId(Long userId, Long messageId);
    int countByMessageIdAndVoteType(Long messageId, VoteType voteType);
}