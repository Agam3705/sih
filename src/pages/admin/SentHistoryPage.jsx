import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PostViewModal from './components/PostViewModal'; // <-- 1. Import the modal
import './SentHistoryPage.css';

export default function SentHistoryPage() {
  const { sentPosts } = useOutletContext();
  const [viewingPost, setViewingPost] = useState(null); // <-- 2. Add state to manage the modal

  return (
    <div className="sent-history-page">
      <h1 className="sent-history-title">Sent Broadcast History</h1>
      <p className="sent-history-subtitle">
        A log of all instant notifications that have been sent to users. Click any card to view details.
      </p>

      <div className="sent-history-list">
        {sentPosts.length > 0 ? (
          [...sentPosts].reverse().map(post => (
            // --- 3. Make the card clickable ---
            <div key={post.id} className="sent-history-card" onClick={() => setViewingPost(post)}>
              <div className="sent-history-details">
                <p><strong>To:</strong> {post.targetAudience.charAt(0).toUpperCase() + post.targetAudience.slice(1)}</p>
                <p><strong>Sent On:</strong> {new Date(post.timestamp).toLocaleString()}</p>
                {/* --- 4. FIX: Use a snippet, not dangerouslySetInnerHTML for the card --- */}
                <p className="sent-history-content-snippet">
                  {post.message.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
              </div>
              {post.attachments?.length > 0 && post.attachments.find(a => a.type === 'image') && (
                 <img 
                    src={post.attachments.find(a => a.type === 'image').previewUrl} 
                    alt="Attachment" 
                    className="sent-history-preview" 
                 />
              )}
            </div>
          ))
        ) : (
          <p className="no-history-message">No broadcasts have been sent yet.</p>
        )}
      </div>

      {/* --- 5. Render the modal --- */}
      <PostViewModal post={viewingPost} onClose={() => setViewingPost(null)} />
    </div>
  );
}