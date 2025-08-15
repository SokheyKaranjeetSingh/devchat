import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Clock, 
  User, 
  Star,
  ArrowUp,
  Tag
} from 'lucide-react';
import './ThreadCard.css';

const ThreadCard = ({ thread }) => {
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const getThreadTags = (content) => {
    // Extract technology tags from content (simplified implementation)
    const tags = ['JavaScript', 'React', 'Node.js', 'Python', 'CSS'];
    return tags.filter(tag => 
      content?.toLowerCase().includes(tag.toLowerCase())
    ).slice(0, 3);
  };

  const tags = getThreadTags(thread.content);

  return (
    <div className="thread-card">
      <div className="thread-card-header">
        <div className="thread-stats">
          <div className="stat-item">
            <ArrowUp size={16} />
            <span>{thread.upvotes || 0}</span>
          </div>
          <div className="stat-item">
            <MessageSquare size={16} />
            <span>{thread.replyCount || 0}</span>
          </div>
        </div>
        
        <div className="thread-main">
          <Link to={`/thread/${thread.id}`} className="thread-title">
            {thread.title}
          </Link>
          
          <p className="thread-excerpt">
            {thread.content?.substring(0, 150)}
            {thread.content?.length > 150 && '...'}
          </p>
          
          {tags.length > 0 && (
            <div className="thread-tags">
              {tags.map(tag => (
                <span key={tag} className="thread-tag">
                  <Tag size={12} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="thread-card-footer">
        <div className="thread-author">
          <div className="author-avatar">
            {thread.user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="author-info">
            <span className="author-name">
              {thread.user?.username || 'Anonymous'}
              {thread.user?.verified && (
                <Star size={12} className="verified-icon" />
              )}
            </span>
            <span className="thread-time">
              <Clock size={12} />
              {formatTimeAgo(thread.createdAt)}
            </span>
          </div>
        </div>

        {thread.lastReply && (
          <div className="last-reply">
            <span className="last-reply-text">
              Last reply by {thread.lastReply.user?.username}
            </span>
            <span className="last-reply-time">
              {formatTimeAgo(thread.lastReply.createdAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadCard;
