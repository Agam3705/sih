import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ChangePasswordModal from './components/ChangePasswordModal';
import { FaMoon, FaSun } from 'react-icons/fa';
import './AdminSettingsPage.css';

export default function AdminSettingsPage() {
  const { theme, toggleTheme } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // This state now just holds the info to display
  const [profile] = useState({ name: 'Admin User', email: 'admin@careerflow.ai' });
  
  const [notifications, setNotifications] = useState({ newMentor: true, weeklySummary: false });

  const handleNotificationChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">Admin Settings</h1>

      <div className="admin-card">
        <h2>Appearance</h2>
        <div className="theme-toggle-wrapper">
          <span>Current Theme: <strong>{theme === 'light' ? 'Light' : 'Dark'}</strong></span>
          <button className="admin-button secondary" onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>

      {/* --- UPDATED: Profile Information Card --- */}
      <div className="admin-card">
        <h2>Profile Information</h2>
        <div className="profile-info-display">
            <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{profile.name}</span>
            </div>
            <div className="info-item">
                <span className="info-label">Email Address</span>
                <span className="info-value">{profile.email}</span>
            </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Security</h2>
        <button className="admin-button primary" onClick={() => setIsModalOpen(true)}>
          Change Password
        </button>
      </div>
      
      <div className="admin-card">
        <h2>Notification Preferences</h2>
        <div className="notification-toggles">
          <div className="toggle-switch">
            <label htmlFor="newMentor">New Mentor Application</label>
            <input type="checkbox" id="newMentor" name="newMentor" checked={notifications.newMentor} onChange={handleNotificationChange} />
          </div>
          <div className="toggle-switch">
            <label htmlFor="weeklySummary">Weekly Summary Report</label>
            <input type="checkbox" id="weeklySummary" name="weeklySummary" checked={notifications.weeklySummary} onChange={handleNotificationChange} />
          </div>
        </div>
      </div>

      <ChangePasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}