package com.devchat.backend.service;

import com.devchat.backend.dto.VoteRequestDto;
import com.devchat.backend.entity.Message;
import com.devchat.backend.entity.User;
import com.devchat.backend.entity.Vote;
import com.devchat.backend.enums.VoteType;
import com.devchat.backend.repository.MessageRepository;
import com.devchat.backend.repository.UserRepository;
import com.devchat.backend.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class VoteServiceImpl implements VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public Map<String, Object> vote(VoteRequestDto dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = messageRepository.findById(dto.getMessageId())
                .orElseThrow(() -> new RuntimeException("Message not found"));

        Optional<Vote> existingVote = voteRepository.findByUserIdAndMessageId(user.getId(), dto.getMessageId());

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();
            if (vote.getVoteType() == dto.getVoteType()) {
                // Same vote type - remove the vote
                voteRepository.delete(vote);
                updateMessageVoteCounts(message);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Vote removed");
                response.put("voteCounts", getVoteCounts(dto.getMessageId()));
                return response;
            } else {
                // Different vote type - update the vote
                vote.setVoteType(dto.getVoteType());
                voteRepository.save(vote);
                updateMessageVoteCounts(message);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Vote updated");
                response.put("voteCounts", getVoteCounts(dto.getMessageId()));
                return response;
            }
        } else {
            // New vote
            Vote newVote = new Vote();
            newVote.setUser(user);
            newVote.setMessage(message);
            newVote.setVoteType(dto.getVoteType());
            voteRepository.save(newVote);
            updateMessageVoteCounts(message);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Vote added");
            response.put("voteCounts", getVoteCounts(dto.getMessageId()));
            return response;
        }
    }

    @Override
    public Map<String, Integer> getVoteCounts(Long messageId) {
        int upvotes = voteRepository.countByMessageIdAndVoteType(messageId, VoteType.UPVOTE);
        int downvotes = voteRepository.countByMessageIdAndVoteType(messageId, VoteType.DOWNVOTE);

        Map<String, Integer> counts = new HashMap<>();
        counts.put("upvotes", upvotes);
        counts.put("downvotes", downvotes);
        return counts;
    }

    private void updateMessageVoteCounts(Message message) {
        int upvotes = voteRepository.countByMessageIdAndVoteType(message.getId(), VoteType.UPVOTE);
        int downvotes = voteRepository.countByMessageIdAndVoteType(message.getId(), VoteType.DOWNVOTE);

        message.setUpvotes(upvotes);
        message.setDownvotes(downvotes);
        messageRepository.save(message);
    }
}