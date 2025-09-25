import React, { useState, useEffect } from 'react';
import { FaTimes, FaPaperPlane, FaReply } from 'react-icons/fa';
import './RequestViewModal.css';

export default function RequestViewModal({ request, onClose, onStatusChange, onReply }) {
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
      if (request) {
          setReplyMessage('');
      }
  }, [request]);

  if (!request) return null;

  const handleReply = () => {
    if (replyMessage.trim()) {
      onReply(request.id, replyMessage);
      setReplyMessage(''); // Clear the input box after sending
    }
  };

  return (
    <div className="request-modal-overlay" onClick={onClose}>
      <div className="request-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="request-modal-header">
          <h2>Request Details</h2>
          <button onClick={onClose} className="modal-close-btn"><FaTimes /></button>
        </div>
        <div className="request-modal-body">
          <div className="detail-row">
            <strong>From:</strong> {request.userName} (ID: {request.userId})
          </div>
          <div className="detail-row">
            <strong>Category:</strong> {request.category}
          </div>
          <div className="detail-row">
            <strong>Submitted:</strong> {request.submittedAt.toLocaleString()}
          </div>
          <hr className="detail-divider" />
          <div className="detail-content">
            {Object.entries(request.details).map(([key, value]) => {
              const isImage = key === 'image' && typeof value === 'string' && value.startsWith('https');
              return (
                <div key={key} className="detail-item">
                  <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                  {isImage ? (
                    <img src={value} alt="Event Submission" className="detail-image-preview" />
                  ) : (
                    <p>{value.toString()}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* --- THIS SECTION DISPLAYS THE REPLIES --- */}
          {request.replies && request.replies.length > 0 && (
            <div className="reply-history-section">
                <h3><FaReply /> Reply History</h3>
                {request.replies.map((reply, index) => (
                    <div key={index} className="reply-bubble">
                        <p className="reply-text">{reply.text}</p>
                        <span className="reply-timestamp">
                            Sent by {reply.author} on {reply.timestamp.toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
          )}
        </div>
        
        <div className="request-modal-footer">
          {request.status === 'Pending' && (
            <div className="status-actions">
              <button className="admin-button secondary reject" onClick={() => onStatusChange(request.id, 'Rejected')}>Reject</button>
              <button className="admin-button primary approve" onClick={() => onStatusChange(request.id, 'Approved')}>Approve</button>
            </div>
          )}
           <div className="reply-section">
            <textarea 
              placeholder={`Reply to ${request.userName}...`} 
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <button className="admin-button primary" onClick={handleReply} disabled={!replyMessage.trim()}>
              <FaPaperPlane /> Send Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}