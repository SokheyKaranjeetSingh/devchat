package com.devchat.backend.dto;

public class MessageRequestDto {
    private Long threadId;
    private String content;

    public Long getThreadId() { return threadId; }
    public void setThreadId(Long threadId) { this.threadId = threadId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}