import React, { useState, useEffect } from 'react';
import { getFiles } from '../services/api';
import { FileMeta } from '../types';
import './FileDashboard.css';

const FileDashboard: React.FC = () => {
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'clean' | 'infected'>('all');

  const fetchFiles = async () => {
    try {
      const data = await getFiles();
      setFiles(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch files');
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchFiles, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string, result: string | null) => {
    if (status === 'pending') return '⏳';
    if (result === 'clean') return '✅';
    if (result === 'infected') return '🚨';
    if (result === 'error') return '❌';
    return '❓';
  };

  const getStatusColor = (status: string, result: string | null) => {
    if (status === 'pending') return 'pending';
    if (result === 'clean') return 'clean';
    if (result === 'infected') return 'infected';
    if (result === 'error') return 'error';
    return 'unknown';
  };

  const getStatusText = (status: string, result: string | null) => {
    if (status === 'pending') return 'Pending';
    if (result === 'clean') return 'Clean';
    if (result === 'infected') return 'Infected';
    if (result === 'error') return 'Error';
    return 'Unknown';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredFiles = files.filter(file => {
    if (filter === 'all') return true;
    if (filter === 'pending') return file.status === 'pending';
    if (filter === 'clean') return file.result === 'clean';
    if (filter === 'infected') return file.result === 'infected';
    return true;
  });

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading files...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>File Scan Dashboard</h2>
        <div className="filter-controls">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({files.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({files.filter(f => f.status === 'pending').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'clean' ? 'active' : ''}`}
            onClick={() => setFilter('clean')}
          >
            Clean ({files.filter(f => f.result === 'clean').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'infected' ? 'active' : ''}`}
            onClick={() => setFilter('infected')}
          >
            Infected ({files.filter(f => f.result === 'infected').length})
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="files-grid">
        {filteredFiles.length === 0 ? (
          <div className="no-files">
            {filter === 'all' ? 'No files uploaded yet' : `No ${filter} files found`}
          </div>
        ) : (
          filteredFiles.map(file => (
            <div key={file._id} className={`file-card ${getStatusColor(file.status, file.result)}`}>
              <div className="file-header">
                <span className="status-icon">
                  {getStatusIcon(file.status, file.result)}
                </span>
                <span className="status-text">
                  {getStatusText(file.status, file.result)}
                </span>
              </div>
              
              <div className="file-info">
                <h3 className="filename">{file.filename}</h3>
                <p className="upload-time">
                  Uploaded: {formatDate(file.uploadedAt)}
                </p>
                {file.scannedAt && (
                  <p className="scan-time">
                    Scanned: {formatDate(file.scannedAt)}
                  </p>
                )}
              </div>

              {file.status === 'pending' && (
                <div className="scanning-indicator">
                  <div className="spinner"></div>
                  <span>Scanning in progress...</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FileDashboard; 