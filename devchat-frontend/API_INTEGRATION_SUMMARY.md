# DevChat Frontend API Integration Summary

This document summarizes the integration of the new backend APIs into the DevChat frontend application.

## Updated Files

### 1. API Service (`src/services/api.js`)
- **Updated base URL** to `http://localhost:8080/api`
- **Added response interceptor** for handling 401 errors and automatic logout
- **Updated admin endpoints** to match new API structure:
  - `/admin/verify-user/{userId}` → `/admin/verify/{userId}`
  - `/admin/all-users` → `/admin/users`
- **Added new thread operations**:
  - `threadAPI.update(id, threadData)` - Update thread
  - `threadAPI.delete(id)` - Delete thread
- **Added new message operations**:
  - `messageAPI.update(id, messageData)` - Update message
  - `messageAPI.delete(id)` - Delete message
- **Added vote API**:
  - `voteAPI.vote(voteData)` - Vote on message
  - `voteAPI.getCounts(messageId)` - Get vote counts

### 2. Vote Service (`src/services/voteService.js`)
- **New service** for handling voting functionality
- Supports UPVOTE and DOWNVOTE types
- Convenience methods for upvoting and downvoting
- Error handling for vote operations

### 3. Vote Hook (`src/hooks/useVoting.js`)
- **Custom React hook** for managing vote state
- Optimistic UI updates for better user experience
- Automatic vote count fetching
- Support for vote switching and removal

### 4. Vote Button Component (`src/components/Common/VoteButton.js`)
- **Reusable component** for voting on messages
- Real-time vote count display
- Visual feedback for user's current vote
- Disabled state during API calls

### 5. Message Card Component (`src/components/Messages/MessageCard.js`)
- **New component** for displaying individual messages
- Integrated vote functionality
- Edit and delete capabilities for message authors/admins
- Role-based permission checks

### 6. Enhanced Thread Detail (`src/components/Threads/ThreadDetailEnhanced.js`)
- **Enhanced version** with full CRUD operations
- Thread editing and deletion for authors/admins
- Message management with voting
- Better error handling and loading states

### 7. Utility Helpers (`src/utils/helpers.js`)
- **New utility functions** for:
  - API error handling
  - Role-based permission checks
  - Date formatting
  - Data transformation
  - Local storage management

## API Integration Details

### Authentication APIs
```javascript
// Registration with role selection
authAPI.register({
  username: "testuser",
  email: "test@example.com", 
  password: "password123",
  role: "USER" // USER, DEV, ADMIN, SUPERADMIN
});

// Login
authAPI.login({
  username: "testuser",
  password: "password123"
});
```

### Thread APIs
```javascript
// Get all threads
threadAPI.getAll();

// Get specific thread
threadAPI.getById(id);

// Create thread
threadAPI.create({
  title: "My Thread Title",
  content: "Thread content"
});

// Update thread (author only)
threadAPI.update(id, {
  title: "Updated Title",
  content: "Updated content"
});

// Delete thread (author only)
threadAPI.delete(id);

// Search threads
threadAPI.search("keyword");
```

### Message APIs
```javascript
// Get messages for thread
messageAPI.getByThread(threadId);

// Create message (DEV users only)
messageAPI.create({
  threadId: 1,
  content: "My reply"
});

// Update message (author only)
messageAPI.update(id, {
  content: "Updated content"
});

// Delete message (author only)
messageAPI.delete(id);
```

### Vote APIs
```javascript
// Vote on message
voteAPI.vote({
  messageId: 1,
  voteType: "UPVOTE" // or "DOWNVOTE"
});

// Get vote counts
voteAPI.getCounts(messageId);
```

### Admin APIs
```javascript
// Get pending users (Admin/SuperAdmin only)
adminAPI.getPendingUsers();

// Verify user (Admin/SuperAdmin only)
adminAPI.verifyUser(userId);

// Get all users (Admin/SuperAdmin only)
adminAPI.getAllUsers();
```

## Role-Based Permissions

### User Roles
- **USER**: Can create threads, vote on messages
- **DEV**: Can create threads, reply to threads, vote on messages
- **ADMIN**: Can moderate content, verify users, all DEV permissions
- **SUPERADMIN**: Full access to all features

### Permission Checks
```javascript
import { canCreateMessage, canModerate, canVote } from '../utils/helpers';

// Check if user can reply to threads
const canReply = canCreateMessage(user.role);

// Check if user can edit/delete content
const canEdit = canModerate(user.role, contentAuthorId, user.id);

// Check if user can vote
const canUserVote = canVote(user.role);
```

## Error Handling

### API Error Interceptor
- Automatically handles 401 errors (unauthorized)
- Redirects to login on authentication failure
- Clears stored authentication data

### Component Error Handling
```javascript
import { handleAPIError } from '../utils/helpers';

try {
  await threadAPI.create(threadData);
} catch (error) {
  const errorMessage = handleAPIError(error, 'Failed to create thread');
  toast.error(errorMessage);
}
```

## Usage Examples

### Voting Component Integration
```jsx
import VoteButton from '../Common/VoteButton';

<VoteButton
  messageId={message.id}
  initialUpvotes={message.upvotes}
  initialDownvotes={message.downvotes}
  userVote={message.userVote}
/>
```

### Permission-Based UI
```jsx
import { canCreateMessage } from '../utils/helpers';

const canReply = canCreateMessage(user?.role);

{canReply && (
  <MessageForm threadId={threadId} onMessageAdded={handleMessageAdded} />
)}

{!canReply && user && (
  <p>Only developers and admins can reply to threads.</p>
)}
```

## Environment Configuration

Make sure your `.env` file includes the necessary configuration:
```
NODE_OPTIONS=--openssl-legacy-provider
REACT_APP_API_URL=http://localhost:8080/api
```

## Next Steps

1. **Test the integration** with your backend server
2. **Update existing components** to use the new APIs as needed
3. **Add loading states** and error boundaries where appropriate
4. **Implement real-time updates** using WebSockets or polling if needed
5. **Add unit tests** for the new API integration

The integration provides a complete set of tools for interacting with your backend API while maintaining good separation of concerns and reusable components.
