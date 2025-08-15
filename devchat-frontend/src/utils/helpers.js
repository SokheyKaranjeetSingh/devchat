// Utility functions for handling API responses and errors

export const handleAPIError = (error, defaultMessage = 'An error occurred') => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || error.response.data?.error || defaultMessage;
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection and try again.';
  } else {
    // Something else happened
    return error.message || defaultMessage;
  }
};

export const isUnauthorizedError = (error) => {
  return error.response?.status === 401;
};

export const isForbiddenError = (error) => {
  return error.response?.status === 403;
};

export const isNotFoundError = (error) => {
  return error.response?.status === 404;
};

export const isValidationError = (error) => {
  return error.response?.status === 400;
};

// Role-based permission checks
export const ROLES = {
  USER: 'USER',
  DEV: 'DEV',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN'
};

export const hasPermission = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles) return false;
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  
  return userRole === requiredRoles;
};

export const canCreateThread = (userRole) => {
  return hasPermission(userRole, [ROLES.USER, ROLES.DEV, ROLES.ADMIN, ROLES.SUPERADMIN]);
};

export const canCreateMessage = (userRole) => {
  return hasPermission(userRole, [ROLES.DEV, ROLES.ADMIN, ROLES.SUPERADMIN]);
};

export const canVote = (userRole) => {
  return hasPermission(userRole, [ROLES.USER, ROLES.DEV, ROLES.ADMIN, ROLES.SUPERADMIN]);
};

export const canAdministrate = (userRole) => {
  return hasPermission(userRole, [ROLES.ADMIN, ROLES.SUPERADMIN]);
};

export const canModerate = (userRole, resourceOwnerId, currentUserId) => {
  // SuperAdmin and Admin can moderate anything
  if (hasPermission(userRole, [ROLES.ADMIN, ROLES.SUPERADMIN])) {
    return true;
  }
  
  // Users can moderate their own content
  return resourceOwnerId === currentUserId;
};

// Format date utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

export const formatDateFull = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// Data transformation utilities
export const transformUserData = (userData) => ({
  id: userData.id,
  username: userData.username,
  email: userData.email,
  role: userData.role,
  verified: userData.verified,
  createdAt: userData.createdAt,
  updatedAt: userData.updatedAt
});

export const transformThreadData = (threadData) => ({
  id: threadData.id,
  title: threadData.title,
  content: threadData.content,
  authorId: threadData.authorId,
  authorName: threadData.authorName,
  authorRole: threadData.authorRole,
  createdAt: threadData.createdAt,
  updatedAt: threadData.updatedAt,
  messageCount: threadData.messageCount || 0,
  upvotes: threadData.upvotes || 0,
  downvotes: threadData.downvotes || 0
});

export const transformMessageData = (messageData) => ({
  id: messageData.id,
  content: messageData.content,
  threadId: messageData.threadId,
  authorId: messageData.authorId,
  authorName: messageData.authorName,
  authorRole: messageData.authorRole,
  createdAt: messageData.createdAt,
  updatedAt: messageData.updatedAt,
  upvotes: messageData.upvotes || 0,
  downvotes: messageData.downvotes || 0,
  userVote: messageData.userVote || null
});

// Local storage utilities
export const getStoredAuth = () => ({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  verified: localStorage.getItem('verified') === 'true'
});

export const setStoredAuth = (authData) => {
  localStorage.setItem('token', authData.token);
  localStorage.setItem('role', authData.role);
  localStorage.setItem('verified', authData.verified);
};

export const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('verified');
};
