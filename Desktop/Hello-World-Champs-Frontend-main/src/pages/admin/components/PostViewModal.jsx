import React from 'react';
import { FaTimes, FaUserFriends, FaBullseye, FaPaperclip } from 'react-icons/fa';
import './PostViewModal.css';

export default function PostViewModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div className="post-view-modal-overlay" onClick={onClose}>
      <div className="post-view-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="post-view-modal-header">
          <h2>Broadcast Details</h2>
          <button onClick={onClose} className="post-view-close-btn"><FaTimes /></button>
        </div>
        <div className="post-view-modal-body">
          <div className="post-detail-item">
            <FaUserFriends />
            <strong>Target Audience:</strong>
            <span>{post.targetAudience.charAt(0).toUpperCase() + post.targetAudience.slice(1)}</span>
          </div>
          {post.scheduledAt && (
            <div className="post-detail-item">
              <FaBullseye />
              <strong>Scheduled For:</strong>
              <span>{new Date(post.scheduledAt).toLocaleString()}</span>
            </div>
          )}
          <div className="post-message-content" dangerouslySetInnerHTML={{ __html: post.message }} />

          {post.attachments && post.attachments.length > 0 && (
            <div className="post-attachments-section">
              <h3><FaPaperclip /> Attachments</h3>
              <div className="post-attachments-grid">
                {post.attachments.map(att => (
                  <div key={att.id} className="post-attachment-card">
                    {att.type === 'image' && <img src={att.previewUrl} alt={att.file.name} />}
                    {att.type === 'video' && <video src={att.previewUrl} controls />}
                    {att.type === 'audio' && <audio src={att.previewUrl} controls />}
                    <span>{att.file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}