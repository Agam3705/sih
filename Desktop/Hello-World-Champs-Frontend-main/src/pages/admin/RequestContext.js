import React, { createContext, useState, useContext } from 'react';
import { mockRequests } from '../../mockRequests';

// Create the context
const RequestContext = createContext();

// Create a custom hook to easily access the context
export const useRequests = () => {
  return useContext(RequestContext);
};

// Create the provider component that will wrap our admin panel
export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState(mockRequests);

  const updateRequestStatus = (requestId, newStatus) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const addReplyToRequest = (requestId, replyMessage) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          const newReply = {
            author: 'Admin',
            text: replyMessage,
            timestamp: new Date(),
          };
          // Add the new reply to the request's replies array
          const updatedReplies = req.replies ? [...req.replies, newReply] : [newReply];
          return { ...req, replies: updatedReplies };
        }
        return req;
      })
    );
  };

  const value = {
    requests,
    updateRequestStatus,
    addReplyToRequest,
  };

  return (
    <RequestContext.Provider value={value}>
      {children}
    </RequestContext.Provider>
  );
};