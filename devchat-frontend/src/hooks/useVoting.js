import { useState, useEffect } from 'react';
import { voteService, VOTE_TYPES } from '../services/voteService';

export const useVoting = (messageId) => {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVoteCounts = async () => {
      if (!messageId) return;
      
      try {
        const counts = await voteService.getVoteCounts(messageId);
        setUpvotes(counts.upvotes || 0);
        setDownvotes(counts.downvotes || 0);
        setUserVote(counts.userVote || null);
      } catch (error) {
        console.error('Failed to fetch vote counts:', error);
      }
    };

    fetchVoteCounts();
  }, [messageId]);

  const vote = async (voteType) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await voteService.voteOnMessage(messageId, voteType);
      
      // Update local state based on the response
      if (response.success) {
        // Optimistically update the UI
        if (userVote === voteType) {
          // Remove vote if clicking same button
          setUserVote(null);
          if (voteType === VOTE_TYPES.UPVOTE) {
            setUpvotes(prev => prev - 1);
          } else {
            setDownvotes(prev => prev - 1);
          }
        } else {
          // Switch vote or add new vote
          if (userVote === VOTE_TYPES.UPVOTE && voteType === VOTE_TYPES.DOWNVOTE) {
            setUpvotes(prev => prev - 1);
            setDownvotes(prev => prev + 1);
          } else if (userVote === VOTE_TYPES.DOWNVOTE && voteType === VOTE_TYPES.UPVOTE) {
            setDownvotes(prev => prev - 1);
            setUpvotes(prev => prev + 1);
          } else if (!userVote) {
            if (voteType === VOTE_TYPES.UPVOTE) {
              setUpvotes(prev => prev + 1);
            } else {
              setDownvotes(prev => prev + 1);
            }
          }
          setUserVote(voteType);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Failed to vote:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const upvote = () => vote(VOTE_TYPES.UPVOTE);
  const downvote = () => vote(VOTE_TYPES.DOWNVOTE);
  
  const getScore = () => upvotes - downvotes;

  return {
    upvotes,
    downvotes,
    userVote,
    loading,
    upvote,
    downvote,
    vote,
    score: getScore(),
  };
};

export default useVoting;