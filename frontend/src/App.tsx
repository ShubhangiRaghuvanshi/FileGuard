import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import FileDashboard from './components/FileDashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'upload' | 'dashboard'>('upload');

  const handleUploadSuccess = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🛡️ FileGuard</h1>
          <nav className="nav-tabs">
            <button 
              className={`nav-tab ${currentPage === 'upload' ? 'active' : ''}`}
              onClick={() => setCurrentPage('upload')}
            >
              Upload Files
            </button>
            <button 
              className={`nav-tab ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {currentPage === 'upload' ? (
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <FileDashboard />
        )}
      </main>

      <footer className="app-footer">
        <p>CyberXplore Developer Challenge - Secure File Upload & Malware Scanning</p>
      </footer>
    </div>
  );
}

export default App;
