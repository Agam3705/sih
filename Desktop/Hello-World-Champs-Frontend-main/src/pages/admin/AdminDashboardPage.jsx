import React from 'react';
import { Link } from 'react-router-dom';
import { useRequests } from './RequestContext';
import { mockUsers } from './mockUsers';
import { mockMentorApplications } from './mockData';
import { FaUsers, FaUserCheck, FaUserSlash, FaUserClock, FaUserGraduate, FaUserTimes, FaFileUpload, FaBriefcase, FaBug, FaShieldAlt } from 'react-icons/fa';
import './AdminDashboardPage.css';

// Reusable Stat Card Component with Link
const StatCard = ({ icon, value, label, to, state }) => (
  <Link to={to} state={state} className="admin-card stat-card">
    <div className="stat-icon-wrapper">{icon}</div>
    <div className="stat-details">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </Link>
);

export default function AdminDashboardPage() {
  const { requests } = useRequests();

  // --- Calculate User Stats ---
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter(u => !u.isBlocked).length;
  const blockedUsers = mockUsers.filter(u => u.isBlocked).length;

  // --- Calculate Mentor Stats ---
  const pendingMentors = mockMentorApplications.filter(m => m.status === 'pending').length;
  const approvedMentors = mockMentorApplications.filter(m => m.status === 'approved').length;
  const rejectedMentors = mockMentorApplications.filter(m => m.status === 'rejected').length;

  // --- Calculate Pending Request Stats ---
  const eventSubmissions = requests.filter(r => r.category === 'Event Submission' && r.status === 'Pending').length;
  const workRequests = requests.filter(r => r.category === 'Open Work Request' && r.status === 'Pending').length;
  const bugReports = requests.filter(r => r.category === 'Bug Report' && r.status === 'Pending').length;
  const userReports = requests.filter(r => r.category === 'Report User/Mentor' && r.status === 'Pending').length;

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">Admin Dashboard</h1>

      <div className="dashboard-section">
        <h2 className="dashboard-section-title">User Overview</h2>
        <div className="stats-grid">
          <StatCard icon={<FaUsers />} value={totalUsers} label="Total Users" to="/admin/users" />
          <StatCard icon={<FaUserCheck />} value={activeUsers} label="Active Users" to="/admin/users" state={{ statusFilter: 'Active' }} />
          <StatCard icon={<FaUserSlash />} value={blockedUsers} label="Blocked Users" to="/admin/users" state={{ statusFilter: 'Blocked' }} />
        </div>
      </div>
      
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Mentor Overview</h2>
        <div className="stats-grid">
          <StatCard icon={<FaUserClock />} value={pendingMentors} label="Pending Mentors" to="/admin/mentors" state={{ statusFilter: 'pending' }} />
          <StatCard icon={<FaUserGraduate />} value={approvedMentors} label="Approved Mentors" to="/admin/mentors" state={{ statusFilter: 'approved' }} />
          <StatCard icon={<FaUserTimes />} value={rejectedMentors} label="Rejected Mentors" to="/admin/mentors" state={{ statusFilter: 'rejected' }} />
        </div>
      </div>

      {/* --- NEW: Pending Requests Section --- */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Pending Requests</h2>
        <div className="stats-grid">
          <StatCard icon={<FaFileUpload />} value={eventSubmissions} label="Event Submissions" to="/admin/inbox" state={{ categoryFilter: 'Event Submission' }} />
          <StatCard icon={<FaBriefcase />} value={workRequests} label="Work Requests" to="/admin/inbox" state={{ categoryFilter: 'Open Work Request' }} />
          <StatCard icon={<FaBug />} value={bugReports} label="Bug Reports" to="/admin/inbox" state={{ categoryFilter: 'Bug Report' }} />
          <StatCard icon={<FaShieldAlt />} value={userReports} label="User Reports" to="/admin/inbox" state={{ categoryFilter: 'Report User/Mentor' }} />
        </div>
      </div>
    </div>
  );
}