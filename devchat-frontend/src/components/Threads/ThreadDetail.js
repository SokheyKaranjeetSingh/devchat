import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { threadAPI, messageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Layout/Layout';
import MessageForm from '../Messages/MessageForm';
import { 
  ArrowLeft,
  Clock,
  User,
  MessageSquare,
  Star,
  CheckCircle,
  Plus,
  Calendar,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import './ThreadDetailModern.css';

const ThreadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDev, user } = useAuth();
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchThreadAndMessages();
  }, [id]);

  useEffect(() => {
    if (thread) {
      setEditForm({ title: thread.title, content: thread.content });
    }
  }, [thread]);

  const fetchThreadAndMessages = async () => {
    try {
      setLoading(true);
      const [threadResponse, messagesResponse] = await Promise.all([
        threadAPI.getById(id),
        messageAPI.getByThread(id)
      ]);
      
      setThread(threadResponse.data);
      setMessages(messagesResponse.data);
    } catch (error) {
      setError('Failed to load thread details');
      console.error('Error fetching thread details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageAdded = (newMessage) => {
    setMessages(prev => [...prev, newMessage]);
  };

  // Thread Update Functionality
  const handleUpdateThread = async () => {
    if (!editForm.title.trim() || !editForm.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setUpdateLoading(true);
    try {
      const response = await threadAPI.update(id, {
        title: editForm.title.trim(),
        content: editForm.content.trim()
      });
      
      setThread(response.data);
      setIsEditing(false);
      toast.success('Thread updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update thread');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Thread Delete Functionality
  const handleDeleteThread = async () => {
    if (!window.confirm('Are you sure you want to delete this thread? This action cannot be undone.')) {
      return;
    }

    setUpdateLoading(true);
    try {
      await threadAPI.delete(id);
      toast.success('Thread deleted successfully!');
      navigate('/threads');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete thread');
      setUpdateLoading(false);
    }
  };

  // Check if user can edit/delete (thread author or admin)
  const canModifyThread = user && (user.id === thread?.authorId || user.role === 'ADMIN' || user.role === 'SUPERADMIN');

  if (loading) return (
    <Layout>
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading thread details...</p>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    </Layout>
  );

  if (!thread) return (
    <Layout>
      <div className="error-container">
        <div className="error-message">Thread not found</div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="thread-detail-container">
        <div className="thread-header">
          <button onClick={() => navigate('/threads')} className="back-btn">
            <ArrowLeft size={20} />
            Back to Threads
          </button>
        </div>

        <div className="thread-main-card">
          <div className="thread-title-section">
            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="edit-title-input"
                  placeholder="Thread title"
                  disabled={updateLoading}
                />
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                  className="edit-content-input"
                  placeholder="Thread content"
                  rows={6}
                  disabled={updateLoading}
                />
                <div className="edit-actions">
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({ title: thread.title, content: thread.content });
                    }}
                    className="btn btn-secondary"
                    disabled={updateLoading}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdateThread}
                    className="btn btn-primary"
                    disabled={updateLoading || !editForm.title.trim() || !editForm.content.trim()}
                  >
                    <Save size={16} />
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="title-with-actions">
                  <h1 className="thread-title">{thread.title}</h1>
                  {canModifyThread && (
                    <div className="thread-actions">
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="action-btn edit-btn"
                        disabled={updateLoading}
                        title="Edit thread"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={handleDeleteThread}
                        className="action-btn delete-btn"
                        disabled={updateLoading}
                        title="Delete thread"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="thread-meta">
                  <div className="meta-item">
                    <User size={16} />
                    <span>By {thread.author}</span>
                    {thread.verified && <CheckCircle size={14} className="verified-icon" />}
                  </div>
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <MessageSquare size={16} />
                    <span>{messages.length} replies</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="thread-content">
              <div className="content-header">
                <h3>
                  <MessageSquare size={20} />
                  Original Post
                </h3>
              </div>
              <div className="content-body">
                <p>{thread.content}</p>
                {thread.updatedAt && thread.updatedAt !== thread.createdAt && (
                  <div className="last-edited">
                    <small>Last edited: {new Date(thread.updatedAt).toLocaleString()}</small>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="replies-section">
          <div className="section-header">
            <h3 className="section-title">
              <MessageSquare size={20} />
              Replies ({messages.length})
            </h3>
          </div>
          
          {messages.length === 0 ? (
            <div className="empty-replies">
              <MessageSquare size={48} className="empty-icon" />
              <h4>No replies yet</h4>
              <p>{isDev ? 'Be the first to help this user!' : 'Waiting for developer responses...'}</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((message) => (
                <MessageItem 
                  key={message.id} 
                  message={message} 
                  currentUser={user}
                  onMessageUpdated={(updatedMessage) => {
                    setMessages(prev => prev.map(m => m.id === updatedMessage.id ? updatedMessage : m));
                  }}
                  onMessageDeleted={(messageId) => {
                    setMessages(prev => prev.filter(m => m.id !== messageId));
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {isDev && (
          <div className="reply-form-section">
            <div className="section-header">
              <h3 className="section-title">
                <Plus size={20} />
                Add Your Reply
              </h3>
              <p className="section-subtitle">Help this user solve their problem</p>
            </div>
            <div className="reply-form-card">
              <MessageForm 
                threadId={id} 
                onMessageAdded={handleMessageAdded}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// Message Item Component with Edit/Delete functionality
const MessageItem = ({ message, currentUser, onMessageUpdated, onMessageDeleted }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(message.content);
  const [loading, setLoading] = React.useState(false);

  // Check if user can edit/delete (message author or admin)
  const canModifyMessage = currentUser && (
    currentUser.id === message.authorId || 
    currentUser.role === 'ADMIN' || 
    currentUser.role === 'SUPERADMIN'
  );

  const handleUpdateMessage = async () => {
    if (!editContent.trim()) {
      toast.error('Message content cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const response = await messageAPI.update(message.id, {
        content: editContent.trim()
      });
      
      onMessageUpdated(response.data);
      setIsEditing(false);
      toast.success('Message updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update message');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    setLoading(true);
    try {
      await messageAPI.delete(message.id);
      onMessageDeleted(message.id);
      toast.success('Message deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete message');
      setLoading(false);
    }
  };

  return (
    <div className="message-card">
      <div className="message-header">
        <div className="message-author">
          <div className="author-avatar">
            {message.author?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="author-info">
            <span className="author-name">
              {message.author}
              {message.verified && <Star size={12} className="verified-star" />}
            </span>
            <div className="message-time">
              <Clock size={12} />
              {new Date(message.createdAt).toLocaleString()}
              {message.updatedAt && message.updatedAt !== message.createdAt && (
                <span className="edited-indicator"> (edited)</span>
              )}
            </div>
          </div>
        </div>
        
        {canModifyMessage && (
          <div className="message-actions">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="action-btn edit-btn"
              disabled={loading}
              title="Edit message"
            >
              <Edit size={14} />
            </button>
            <button 
              onClick={handleDeleteMessage}
              className="action-btn delete-btn"
              disabled={loading}
              title="Delete message"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      
      <div className="message-content">
        {isEditing ? (
          <div className="message-edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="edit-message-input"
              rows={4}
              disabled={loading}
            />
            <div className="message-edit-actions">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(message.content);
                }}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateMessage}
                className="btn btn-primary"
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
      </div>
    </div>
  );
};

export default ThreadDetail;
