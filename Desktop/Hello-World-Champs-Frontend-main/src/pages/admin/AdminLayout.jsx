import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { RequestProvider } from './RequestContext'; // <-- 1. Import the provider
import { MdDashboard, MdPeople, MdMessage, MdSettings, MdLogout, MdBook, MdHistory, MdEvent, MdSupervisedUserCircle, MdOutlineContentCopy, MdInbox } from 'react-icons/md';
import './AdminLayout.css';
import './AdminTheme.css';

export default function AdminLayout() {
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [sentPosts, setSentPosts] = useState([]);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    // --- 2. Wrap the entire layout in the RequestProvider ---
    <RequestProvider>
      <div className="admin-layout-container" data-theme={theme}>
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">Admin Panel</div>
          <nav className="admin-sidebar-nav">
            <NavLink to="/admin" end className="admin-sidebar-link"><MdDashboard className="admin-sidebar-icon" /> Dashboard</NavLink>
            <NavLink to="/admin/inbox" className="admin-sidebar-link"><MdInbox className="admin-sidebar-icon" /> Inbox</NavLink>
            <NavLink to="/admin/mentors" className="admin-sidebar-link"><MdPeople className="admin-sidebar-icon" /> Manage Mentors</NavLink>
            <NavLink to="/admin/users" className="admin-sidebar-link"><MdSupervisedUserCircle className="admin-sidebar-icon" /> Manage Users</NavLink>
            <NavLink to="/admin/broadcast" className="admin-sidebar-link"><MdMessage className="admin-sidebar-icon" /> Broadcast</NavLink>
            <NavLink to="/admin/events" className="admin-sidebar-link"><MdEvent className="admin-sidebar-icon" /> Manage Events</NavLink>
            <NavLink to="/admin/history" className="admin-sidebar-link"><MdHistory className="admin-sidebar-icon" /> Sent History</NavLink>
            <NavLink to="/admin/guide" className="admin-sidebar-link"><MdBook className="admin-sidebar-icon" /> Readme Guide</NavLink>
          </nav>
          <div className="admin-sidebar-footer">
            <NavLink to="/admin/settings" className="admin-sidebar-link"><MdSettings className="admin-sidebar-icon" /> Settings</NavLink>
            <NavLink to="/logout" className="admin-sidebar-link"><MdLogout className="admin-sidebar-icon" /> Logout</NavLink>
          </div>
        </aside>
        <main className="admin-main-content">
          <Outlet context={{
            scheduledPosts, setScheduledPosts,
            sentPosts, setSentPosts,
            theme, toggleTheme
          }} />
        </main>
      </div>
    </RequestProvider>
  );
}