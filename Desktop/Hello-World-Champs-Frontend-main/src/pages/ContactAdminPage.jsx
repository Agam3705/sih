import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ContactAdminPage.css';

const initialFormState = {
  category: 'Event Submission',
  // Event fields
  eventTitle: '',
  eventDate: '',
  eventLocation: '',
  eventDescription: '',
  // Work fields
  workTitle: '',
  workDescription: '',
  workBudget: '',
  workSkills: '',
  // Report fields
  reportReason: '',
};

export default function ContactAdminPage() {
  const [formData, setFormData] = useState(initialFormState);
  const [sentHistory, setSentHistory] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
        id: `req${Date.now()}`,
        category: formData.category,
        details: { ...formData }, // simplified for mock
        status: 'Pending',
        submittedAt: new Date(),
    };
    setSentHistory(prev => [newRequest, ...prev]);
    alert('Your request has been submitted to the admin for review!');
    setFormData(initialFormState);
  };

  const renderFormFields = () => {
    switch (formData.category) {
      case 'Event Submission':
        return (
          <>
            <input name="eventTitle" value={formData.eventTitle} onChange={handleInputChange} placeholder="Event Title" required />
            <input name="eventDate" type="datetime-local" value={formData.eventDate} onChange={handleInputChange} required />
            <input name="eventLocation" value={formData.eventLocation} onChange={handleInputChange} placeholder="Location / URL" required />
            <textarea name="eventDescription" value={formData.eventDescription} onChange={handleInputChange} placeholder="Event Description" required />
          </>
        );
      case 'Open Work Request':
        return (
          <>
            <input name="workTitle" value={formData.workTitle} onChange={handleInputChange} placeholder="Work Title (e.g., Freelance Writer Needed)" required />
            <input name="workBudget" value={formData.workBudget} onChange={handleInputChange} placeholder="Budget (e.g., ₹5,000)" />
            <input name="workSkills" value={formData.workSkills} onChange={handleInputChange} placeholder="Required Skills (comma-separated)" />
            <textarea name="workDescription" value={formData.workDescription} onChange={handleInputChange} placeholder="Detailed Work Description" required />
          </>
        );
      case 'Bug Report':
        return <textarea name="reportReason" value={formData.reportReason} onChange={handleInputChange} placeholder="Please describe the bug in detail..." required />;
      case 'Report User/Mentor':
        return <textarea name="reportReason" value={formData.reportReason} onChange={handleInputChange} placeholder="Please provide the user's name and a reason for the report..." required />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact-admin-page">
        <div className="contact-form-container">
          <h1>Contact an Administrator</h1>
          <p>Submit an event, post a work request, or report an issue. Your request will be reviewed by our team.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>What is your request about?</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option>Event Submission</option>
                <option>Open Work Request</option>
                <option>Bug Report</option>
                <option>Report User/Mentor</option>
              </select>
            </div>
            <div className="form-group">
                {renderFormFields()}
            </div>
            <div className="warning-note">
              <strong>Please Note:</strong> Submitting false or misleading information may result in your account being blocked.
            </div>
            <button type="submit" className="submit-request-btn">Submit Request</button>
          </form>
        </div>

        <div className="sent-history-container">
            <h2>Your Sent Requests</h2>
            {sentHistory.length > 0 ? (
                <div className="history-list">
                    {sentHistory.map(req => (
                        <div key={req.id} className="history-card">
                            <span className={`status-badge ${req.status.toLowerCase()}`}>{req.status}</span>
                            <p><strong>Category:</strong> {req.category}</p>
                            <p><strong>Submitted:</strong> {req.submittedAt.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have not submitted any requests yet.</p>
            )}
        </div>
      </div>
      <Footer />
    </>
  );
}