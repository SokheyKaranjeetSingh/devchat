package com.devchat.backend.dto;

import com.devchat.backend.enums.VoteType;

public class VoteRequestDto {
    private Long messageId;
    private VoteType voteType;

    public Long getMessageId() { return messageId; }
    public void setMessageId(Long messageId) { this.messageId = messageId; }

    public VoteType getVoteType() { return voteType; }
    public void setVoteType(VoteType voteType) { this.voteType = voteType; }
}