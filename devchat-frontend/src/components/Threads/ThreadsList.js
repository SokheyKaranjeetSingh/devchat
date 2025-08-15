import React, { useState, useEffect } from 'react';
import { threadAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Layout/Layout';
import ThreadCard from './ThreadCard';
import { 
  Search, 
  Plus, 
  Filter, 
  TrendingUp,
  Clock,
  X
} from 'lucide-react';
import './ThreadListModern.css';

const ThreadList = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [filterBy, setFilterBy] = useState('all');
  const navigate = useNavigate();
  const { isUser } = useAuth();

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const response = await threadAPI.getAll();
      setThreads(response.data);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      try {
        setSearchLoading(true);
        const response = await threadAPI.search(searchKeyword);
        setThreads(response.data);
      } catch (error) {
        console.error('Error searching threads:', error);
      } finally {
        setSearchLoading(false);
      }
    } else {
      fetchThreads();
    }
  };

  const clearSearch = () => {
    setSearchKeyword('');
    fetchThreads();
  };

  const sortThreads = (threads) => {
    switch (sortBy) {
      case 'popular':
        return [...threads].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
      case 'replies':
        return [...threads].sort((a, b) => (b.replyCount || 0) - (a.replyCount || 0));
      case 'latest':
      default:
        return [...threads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const sortedThreads = sortThreads(threads);

  if (loading) return (
    <Layout>
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading threads...</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="thread-list-container">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Discussion Threads</h1>
            <p className="page-subtitle">
              Join the conversation with fellow developers
            </p>
          </div>
          {isUser && (
            <button 
              onClick={() => navigate('/create-thread')}
              className="btn btn-primary create-thread-btn"
            >
              <Plus size={18} />
              New Thread
            </button>
          )}
        </div>

        <div className="controls-section">
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search threads by title or content..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="search-input"
                />
                {searchKeyword && (
                  <button 
                    type="button" 
                    onClick={clearSearch} 
                    className="clear-search-btn"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button 
                type="submit" 
                disabled={searchLoading} 
                className="btn btn-secondary search-btn"
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>

          <div className="filters-section">
            <div className="filter-group">
              <label>Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="latest">
                  <Clock size={16} /> Latest
                </option>
                <option value="popular">
                  <TrendingUp size={16} /> Popular
                </option>
                <option value="replies">Most Replies</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Filter by:</label>
              <select 
                value={filterBy} 
                onChange={(e) => setFilterBy(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Threads</option>
                <option value="answered">Answered</option>
                <option value="unanswered">Unanswered</option>
                <option value="recent">Recent Activity</option>
              </select>
            </div>
          </div>
        </div>

        <div className="threads-section">
          {threads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Filter size={48} />
              </div>
              <h3>
                {searchKeyword ? 
                  'No threads found' : 
                  'No threads yet'
                }
              </h3>
              <p>
                {searchKeyword ? 
                  'Try adjusting your search terms or filters.' : 
                  'Be the first to start a discussion!'
                }
              </p>
              {isUser && !searchKeyword && (
                <button 
                  onClick={() => navigate('/create-thread')}
                  className="btn btn-primary"
                >
                  <Plus size={18} />
                  Create First Thread
                </button>
              )}
            </div>
          ) : (
            <div className="threads-grid">
              {sortedThreads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ThreadList;