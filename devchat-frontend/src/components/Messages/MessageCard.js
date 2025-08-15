import React, { useState } from 'react';
import { messageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import VoteButton from '../Common/VoteButton';
import { Edit, Trash2, User, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import './MessageCard.css';

const MessageCard = ({ message, onMessageUpdated, onMessageDeleted }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [loading, setLoading] = useState(false);

  const canEdit = user && (user.id === message.authorId || user.role === 'ADMIN' || user.role === 'SUPERADMIN');
  const canDelete = user && (user.id === message.authorId || user.role === 'ADMIN' || user.role === 'SUPERADMIN');

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Message content cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const response = await messageAPI.update(message.id, {
        content: editContent.trim()
      });
      
      toast.success('Message updated successfully');
      setIsEditing(false);
      onMessageUpdated && onMessageUpdated(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update message');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    setLoading(true);
    try {
      await messageAPI.delete(message.id);
      toast.success('Message deleted successfully');
      onMessageDeleted && onMessageDeleted(message.id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete message');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="message-card">
      <div className="message-header">
        <div className="message-author">
          <div className="author-avatar">
            <User size={16} />
          </div>
          <div className="author-info">
            <span className="author-name">{message.authorName || 'Anonymous'}</span>
            <span className="author-role">{message.authorRole}</span>
          </div>
        </div>
        
        <div className="message-meta">
          <div className="message-date">
            <Clock size={14} />
            <span>{formatDate(message.createdAt)}</span>
          </div>
          
          {(canEdit || canDelete) && (
            <div className="message-actions">
              {canEdit && !isEditing && (
                <button
                  className="action-btn edit-btn"
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                  title="Edit message"
                >
                  <Edit size={14} />
                </button>
              )}
              
              {canDelete && (
                <button
                  className="action-btn delete-btn"
                  onClick={handleDelete}
                  disabled={loading}
                  title="Delete message"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="message-content">
        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="edit-textarea"
              disabled={loading}
            />
            <div className="edit-actions">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(message.content);
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSaveEdit}
                disabled={loading || !editContent.trim()}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <div className="message-text">
            {message.content}
          </div>
        )}
        
        {message.updatedAt && message.updatedAt !== message.createdAt && (
          <div className="message-edited">
            <small>Edited {formatDate(message.updatedAt)}</small>
          </div>
        )}
      </div>

      <div className="message-footer">
        <VoteButton
          messageId={message.id}
          initialUpvotes={message.upvotes}
          initialDownvotes={message.downvotes}
          userVote={message.userVote}
        />
      </div>
    </div>
  );
};

export default MessageCard;
