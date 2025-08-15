import React, { useState, useEffect } from 'react';
import { voteService, VOTE_TYPES } from '../../services/voteService';
import './VoteButton.css';

const VoteButton = ({ messageId, initialUpvotes = 0, initialDownvotes = 0, userVote = null }) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [currentVote, setCurrentVote] = useState(userVote);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVoteCounts = async () => {
      try {
        const counts = await voteService.getVoteCounts(messageId);
        setUpvotes(counts.upvotes || 0);
        setDownvotes(counts.downvotes || 0);
      } catch (error) {
        console.error('Failed to fetch vote counts:', error);
      }
    };

    if (messageId) {
      fetchVoteCounts();
    }
  }, [messageId]);

  const handleVote = async (voteType) => {
    if (loading) return;
    
    setLoading(true);
    try {
      await voteService.voteOnMessage(messageId, voteType);
      
      // Update local state based on vote
      if (currentVote === voteType) {
        // Remove vote if clicking same button
        setCurrentVote(null);
        if (voteType === VOTE_TYPES.UPVOTE) {
          setUpvotes(prev => prev - 1);
        } else {
          setDownvotes(prev => prev - 1);
        }
      } else {
        // Switch vote or add new vote
        if (currentVote === VOTE_TYPES.UPVOTE && voteType === VOTE_TYPES.DOWNVOTE) {
          setUpvotes(prev => prev - 1);
          setDownvotes(prev => prev + 1);
        } else if (currentVote === VOTE_TYPES.DOWNVOTE && voteType === VOTE_TYPES.UPVOTE) {
          setDownvotes(prev => prev - 1);
          setUpvotes(prev => prev + 1);
        } else if (!currentVote) {
          if (voteType === VOTE_TYPES.UPVOTE) {
            setUpvotes(prev => prev + 1);
          } else {
            setDownvotes(prev => prev + 1);
          }
        }
        setCurrentVote(voteType);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScore = () => upvotes - downvotes;

  return (
    <div className="vote-buttons">
      <button
        className={`vote-btn upvote ${currentVote === VOTE_TYPES.UPVOTE ? 'active' : ''}`}
        onClick={() => handleVote(VOTE_TYPES.UPVOTE)}
        disabled={loading}
        title="Upvote"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z"/>
        </svg>
        <span className="vote-count">{upvotes}</span>
      </button>
      
      <div className="vote-score">
        <span className={`score ${getScore() > 0 ? 'positive' : getScore() < 0 ? 'negative' : ''}`}>
          {getScore()}
        </span>
      </div>
      
      <button
        className={`vote-btn downvote ${currentVote === VOTE_TYPES.DOWNVOTE ? 'active' : ''}`}
        onClick={() => handleVote(VOTE_TYPES.DOWNVOTE)}
        disabled={loading}
        title="Downvote"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20l-8-8h6V4h4v8h6l-8 8z"/>
        </svg>
        <span className="vote-count">{downvotes}</span>
      </button>
    </div>
  );
};

export default VoteButton;