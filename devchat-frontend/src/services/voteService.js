import { voteAPI } from './api';

export const VOTE_TYPES = {
  UPVOTE: 'UPVOTE',
  DOWNVOTE: 'DOWNVOTE'
};

export const voteService = {
  // Vote on a message
  voteOnMessage: async (messageId, voteType) => {
    try {
      const response = await voteAPI.vote({
        messageId,
        voteType
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get vote counts for a message
  getVoteCounts: async (messageId) => {
    try {
      const response = await voteAPI.getCounts(messageId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Convenience methods
  upvote: async (messageId) => {
    return voteService.voteOnMessage(messageId, VOTE_TYPES.UPVOTE);
  },

  downvote: async (messageId) => {
    return voteService.voteOnMessage(messageId, VOTE_TYPES.DOWNVOTE);
  }
};

export default voteService;