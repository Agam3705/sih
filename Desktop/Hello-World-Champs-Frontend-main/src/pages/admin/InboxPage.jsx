import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRequests } from './RequestContext';
import RequestViewModal from './components/RequestViewModal';
import './InboxPage.css';

export default function InboxPage() {
  const { requests, updateRequestStatus, addReplyToRequest } = useRequests();
  const location = useLocation();

  // Set initial state from the location state passed by the dashboard
  const [activeCategory, setActiveCategory] = useState(location.state?.categoryFilter || 'All');
  const [activeStatus, setActiveStatus] = useState('Pending'); // Default to Pending for a cleaner inbox
  const [viewingRequest, setViewingRequest] = useState(null);

  // Update filter if user navigates here again with a new filter
  useEffect(() => {
    if (location.state?.categoryFilter) {
      setActiveCategory(location.state.categoryFilter);
    }
  }, [location.state]);

  const handleStatusChange = (requestId, newStatus) => {
    updateRequestStatus(requestId, newStatus);
    setViewingRequest(null);
    alert(`Request ${requestId} has been marked as ${newStatus}.`);
  };

  const handleReply = (requestId, message) => {
      addReplyToRequest(requestId, message);
      alert(`Reply sent for request ${requestId}.`);
  };

  const categories = ['All', 'Event Submission', 'Open Work Request', 'Bug Report', 'Report User/Mentor'];
  const statuses = ['All', 'Pending', 'Approved', 'Rejected'];

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const categoryMatch = activeCategory === 'All' || req.category === activeCategory;
      const statusMatch = activeStatus === 'All' || req.status === activeStatus;
      return categoryMatch && statusMatch;
    });
  }, [requests, activeCategory, activeStatus]);

  return (
    <div className="inbox-page">
      <h1 className="admin-page-title">Admin Inbox</h1>
      
      <div className="inbox-filters">
        <div className="filter-group">
            <span className="filter-label">Category:</span>
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
        </div>
        <div className="filter-group">
            <span className="filter-label">Status:</span>
            {statuses.map(status => (
              <button 
                key={status} 
                className={`filter-btn status-${status.toLowerCase()} ${activeStatus === status ? 'active' : ''}`}
                onClick={() => setActiveStatus(status)}
              >
                {status}
              </button>
            ))}
        </div>
      </div>

      <div className="request-list">
        {filteredRequests.length > 0 ? filteredRequests.map(req => (
          <div key={req.id} className="request-card" onClick={() => setViewingRequest(req)}>
            <div className="request-header">
              <h3>{req.category}</h3>
              <span className={`status-indicator ${req.status.toLowerCase()}`}></span>
            </div>
            <div className="request-body">
              <p><strong>From:</strong> {req.userName}</p>
              <p><strong>Submitted:</strong> {req.submittedAt.toLocaleDateString()}</p>
              <p className="request-snippet">
                {Object.values(req.details)[0].toString().substring(0, 100)}...
              </p>
            </div>
          </div>
        )) : <p className="no-requests-message">No requests match the current filters.</p>}
      </div>

      <RequestViewModal 
        request={viewingRequest} 
        onClose={() => setViewingRequest(null)}
        onStatusChange={handleStatusChange}
        onReply={handleReply}
      />
    </div>
  );
}