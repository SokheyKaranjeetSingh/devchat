import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { threadAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Layout/Layout';
import { toast } from 'react-toastify';
import { 
  ArrowLeft,
  Plus,
  FileText,
  MessageSquare,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import './CreateThreadModern.css';

const CreateThread = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const { isUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if not a USER
  if (!isUser) {
    navigate('/dashboard');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const response = await threadAPI.create(formData);
      toast.success('Thread created successfully!');
      navigate(`/thread/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create thread');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="create-thread-container">
        <div className="create-thread-header">
          <button onClick={() => navigate('/threads')} className="back-btn">
            <ArrowLeft size={20} />
            Back to Threads
          </button>
          <div className="header-content">
            <h1 className="page-title">
              <Plus size={32} />
              Create New Thread
            </h1>
            <p className="page-subtitle">Ask a question or start a discussion with the community</p>
          </div>
        </div>

        <div className="form-section">
          <form onSubmit={handleSubmit} className="create-thread-form">
            <div className="form-group">
              <label htmlFor="title">
                <FileText size={18} />
                Thread Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a clear, descriptive title..."
                required
                maxLength={200}
                className="modern-input"
              />
              <small className="form-hint">Be specific and clear about your question or topic</small>
            </div>

            <div className="form-group">
              <label htmlFor="content">
                <MessageSquare size={18} />
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Describe your question or topic in detail..."
                required
                rows={12}
                maxLength={2000}
                className="modern-textarea"
              />
              <small className="form-hint">
                Provide as much detail as possible to help others understand your question
              </small>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/threads')}
                className="cancel-btn"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    Create Thread
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="tips-section">
          <div className="tips-card">
            <div className="tips-header">
              <Lightbulb size={24} />
              <h3>Tips for creating a good thread</h3>
            </div>
            <div className="tips-list">
              <div className="tip-item">
                <CheckCircle size={16} />
                <span>Use a clear, descriptive title that summarizes your question</span>
              </div>
              <div className="tip-item">
                <CheckCircle size={16} />
                <span>Provide enough context and details in the content</span>
              </div>
              <div className="tip-item">
                <CheckCircle size={16} />
                <span>Include relevant code snippets or error messages if applicable</span>
              </div>
              <div className="tip-item">
                <CheckCircle size={16} />
                <span>Be respectful and follow community guidelines</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateThread;
