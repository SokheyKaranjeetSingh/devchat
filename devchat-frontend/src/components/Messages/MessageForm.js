import React, { useState } from 'react';
import { messageAPI } from '../../services/api';
import { toast } from 'react-toastify';
import './MessageForm.css';

const MessageForm = ({ threadId, onMessageAdded }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    
    try {
      const response = await messageAPI.create({
        threadId: parseInt(threadId),
        content: content.trim()
      });
      
      toast.success('Reply posted successfully!');
      setContent('');
      onMessageAdded(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <div className="form-group">
        <label htmlFor="content">Your Reply</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your helpful response here..."
          required
          rows={5}
          maxLength={1000}
        />
        <small>Be helpful and constructive in your response</small>
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          disabled={loading || !content.trim()}
          className="submit-btn"
        >
          {loading ? 'Posting...' : 'Post Reply'}
        </button>
      </div>
    </form>
  );
};

export default MessageForm;
