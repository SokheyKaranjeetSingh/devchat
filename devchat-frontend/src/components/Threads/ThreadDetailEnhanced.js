import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { threadAPI, messageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { canCreateMessage, canModerate, handleAPIError, formatDate } from '../../utils/helpers';
import Layout from '../Layout/Layout';
import MessageForm from '../Messages/MessageForm';
import MessageCard from '../Messages/MessageCard';
import { 
  ArrowLeft,
  Clock,
  User,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';
import './ThreadDetailModern.css';

const ThreadDetailEnhanced = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', content: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchThreadAndMessages();
  }, [id]);

  useEffect(() => {
    if (thread) {
      setEditData({ title: thread.title, content: thread.content });
    }
  }, [thread]);

  const fetchThreadAndMessages = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [threadResponse, messagesResponse] = await Promise.all([
        threadAPI.getById(id),
        messageAPI.getByThread(id)
      ]);
      
      setThread(threadResponse.data);
      setMessages(messagesResponse.data || []);
    } catch (error) {
      const errorMessage = handleAPIError(error, 'Failed to load thread details');
      setError(errorMessage);
      console.error('Error fetching thread details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageAdded = (newMessage) => {
    setMessages(prev => [...prev, newMessage]);
    // Update message count if available
    if (thread) {
      setThread(prev => ({ 
        ...prev, 
        messageCount: (prev.messageCount || 0) + 1 
      }));
    }
  };

  const handleMessageUpdated = (updatedMessage) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === updatedMessage.id ? updatedMessage : msg
      )
    );
  };

  const handleMessageDeleted = (messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
    // Update message count if available
    if (thread) {
      setThread(prev => ({ 
        ...prev, 
        messageCount: Math.max((prev.messageCount || 0) - 1, 0) 
      }));
    }
  };

  const handleUpdateThread = async () => {
    if (!editData.title.trim() || !editData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setUpdateLoading(true);
    try {
      const response = await threadAPI.update(id, {
        title: editData.title.trim(),
        content: editData.content.trim()
      });
      
      setThread(response.data);
      setIsEditing(false);
      toast.success('Thread updated successfully');
    } catch (error) {
      const errorMessage = handleAPIError(error, 'Failed to update thread');
      toast.error(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteThread = async () => {
    if (!window.confirm('Are you sure you want to delete this thread? This action cannot be undone.')) {
      return;
    }

    setUpdateLoading(true);
    try {
      await threadAPI.delete(id);
      toast.success('Thread deleted successfully');
      navigate('/threads');
    } catch (error) {
      const errorMessage = handleAPIError(error, 'Failed to delete thread');
      toast.error(errorMessage);
      setUpdateLoading(false);
    }
  };

  const canEditThread = thread && user && canModerate(user.role, thread.authorId, user.id);
  const canDeleteThread = canEditThread;
  const canReply = user && canCreateMessage(user.role);

  if (loading) {
    return (
      <Layout>
        <div className="thread-detail-loading">
          <div className="loading-spinner"></div>
          <p>Loading thread...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="thread-detail-error">
          <h2>Error Loading Thread</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={fetchThreadAndMessages}
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  if (!thread) {
    return (
      <Layout>
        <div className="thread-detail-error">
          <h2>Thread Not Found</h2>
          <p>The thread you're looking for doesn't exist or has been removed.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/threads')}
          >
            Back to Threads
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="thread-detail-container">
        <div className="thread-detail-header">
          <button 
            className="back-button"
            onClick={() => navigate('/threads')}
          >
            <ArrowLeft size={20} />
            Back to Threads
          </button>
        </div>

        <div className="thread-detail-content">
          <div className="thread-main">
            {isEditing ? (
              <div className="thread-edit-form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="thread-title-input"
                    disabled={updateLoading}
                  />
                </div>
                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    value={editData.content}
                    onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="thread-content-input"
                    disabled={updateLoading}
                  />
                </div>
                <div className="edit-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({ title: thread.title, content: thread.content });
                    }}
                    disabled={updateLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateThread}
                    disabled={updateLoading || !editData.title.trim() || !editData.content.trim()}
                  >
                    {updateLoading ? 'Updating...' : 'Update Thread'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="thread-header">
                  <div className="thread-title-section">
                    <h1 className="thread-title">{thread.title}</h1>
                    {(canEditThread || canDeleteThread) && (
                      <div className="thread-actions">
                        {canEditThread && (
                          <button
                            className="action-btn edit-btn"
                            onClick={() => setIsEditing(true)}
                            disabled={updateLoading}
                            title="Edit thread"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {canDeleteThread && (
                          <button
                            className="action-btn delete-btn"
                            onClick={handleDeleteThread}
                            disabled={updateLoading}
                            title="Delete thread"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="thread-meta">
                    <div className="thread-author">
                      <div className="author-avatar">
                        <User size={16} />
                      </div>
                      <div className="author-info">
                        <span className="author-name">{thread.authorName}</span>
                        <span className="author-role">{thread.authorRole}</span>
                      </div>
                    </div>
                    
                    <div className="thread-stats">
                      <div className="stat-item">
                        <Clock size={14} />
                        <span>{formatDate(thread.createdAt)}</span>
                      </div>
                      <div className="stat-item">
                        <MessageSquare size={14} />
                        <span>{messages.length} replies</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="thread-content">
                  <p>{thread.content}</p>
                  
                  {thread.updatedAt && thread.updatedAt !== thread.createdAt && (
                    <div className="thread-edited">
                      <small>Edited {formatDate(thread.updatedAt)}</small>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="messages-section">
            <div className="messages-header">
              <h3>Replies ({messages.length})</h3>
            </div>
            
            <div className="messages-list">
              {messages.length === 0 ? (
                <div className="no-messages">
                  <MessageSquare size={48} />
                  <h4>No replies yet</h4>
                  <p>Be the first to help with this question!</p>
                </div>
              ) : (
                messages.map(message => (
                  <MessageCard
                    key={message.id}
                    message={message}
                    onMessageUpdated={handleMessageUpdated}
                    onMessageDeleted={handleMessageDeleted}
                  />
                ))
              )}
            </div>

            {canReply && (
              <div className="reply-section">
                <h4>Post a Reply</h4>
                <MessageForm 
                  threadId={id} 
                  onMessageAdded={handleMessageAdded}
                />
              </div>
            )}
            
            {!canReply && user && (
              <div className="reply-restricted">
                <p>Only developers and admins can reply to threads.</p>
              </div>
            )}
            
            {!user && (
              <div className="reply-login-prompt">
                <p>Please <a href="/login">login</a> to reply to this thread.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThreadDetailEnhanced;
