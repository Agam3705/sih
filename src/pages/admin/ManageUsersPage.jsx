import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { mockUsers } from './mockUsers';
import EducationChart from './components/EducationChart';
import InterestChart from './components/InterestChart';
import './ManageUsersPage.css';

const UserDetailModal = ({ user, onClose, onBlockUser }) => {
    if (!user) return null;
    return (
        <div className="user-modal-overlay" onClick={onClose}>
            <div className="user-modal-content" onClick={e => e.stopPropagation()}>
                <div className="user-modal-header">
                    <h2>{user.name}'s Profile {user.isBlocked && <span className="user-status-tag blocked">Blocked</span>}</h2>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className="user-modal-body">
                    <div className="user-modal-profile">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Join Date:</strong> {user.joinDate.toLocaleDateString()}</p>
                        <p><strong>Status:</strong> {user.isBlocked ? 'Blocked' : 'Active'}</p>
                    </div>
                    <hr className="detail-divider" />
                    <h3>Quiz Answers</h3>
                    {Object.entries(user.quizAnswers).map(([question, answer]) => (
                        <div key={question} className="answer-block">
                            <strong>{question}</strong>
                            <p>{Array.isArray(answer) ? answer.join(', ') : (answer || 'Not answered')}</p>
                        </div>
                    ))}
                </div>
                <div className="user-modal-footer">
                    <button
                      className={`admin-button ${user.isBlocked ? 'success' : 'danger'}`}
                      onClick={() => onBlockUser(user.id)}
                    >
                      {user.isBlocked ? 'Unblock User' : 'Block User'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ManageUsersPage() {
  const { theme } = useOutletContext();
  const location = useLocation();
  const [users, setUsers] = useState(mockUsers.map(user => ({ ...user, isBlocked: user.isBlocked || false })));
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(location.state?.statusFilter || 'All');
  const [educationFilter, setEducationFilter] = useState(null);
  const [interestFilter, setInterestFilter] = useState(null);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Effect to update filter if user navigates here from the dashboard
  useEffect(() => {
    if (location.state?.statusFilter) {
      setStatusFilter(location.state.statusFilter);
    }
  }, [location.state]);

  const handleBlockUser = (userId) => {
    const userToUpdate = users.find(u => u.id === userId);
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
    setSelectedUser(prevUser => (
        prevUser && prevUser.id === userId ? { ...prevUser, isBlocked: !prevUser.isBlocked } : prevUser
    ));
    alert(`User ${userToUpdate.name} has been ${userToUpdate.isBlocked ? 'unblocked' : 'blocked'}.`);
  };

  const handleEducationClick = (label) => {
    setEducationFilter(prev => (prev === label ? null : label));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleInterestClick = (label) => {
    setInterestFilter(prev => (prev === label ? null : label));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'All' ||
                          (statusFilter === 'Active' && !user.isBlocked) ||
                          (statusFilter === 'Blocked' && user.isBlocked);
      const educationMatch = !educationFilter || user.quizAnswers["What is your current educational status?"] === educationFilter;
      const interests = user.quizAnswers["Which career fields interest you the most?"];
      const interestMatch = !interestFilter || (Array.isArray(interests) && interests.includes(interestFilter));

      return searchMatch && statusMatch && educationMatch && interestMatch;
    });
  }, [users, searchTerm, statusFilter, educationFilter, interestFilter]);

  // --- Pagination Logic ---
  const totalPages = itemsPerPage === 'All' ? 1 : Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    if (itemsPerPage === 'All') {
      return filteredUsers;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value === 'All' ? 'All' : Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-title">User Management</h1>

      <div className="admin-card chart-container">
          <EducationChart users={users} theme={theme} onClick={handleEducationClick} />
      </div>
      <div className="admin-card chart-container">
          <InterestChart users={users} theme={theme} onClick={handleInterestClick} />
      </div>

      <div className="admin-card">
        <h2>All Users ({filteredUsers.length})</h2>
        <div className="user-filters">
            <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
            </select>
        </div>

        <div className="active-filters-display">
            {educationFilter && <span className="filter-tag" onClick={() => setEducationFilter(null)}>Education: {educationFilter} &times;</span>}
            {interestFilter && <span className="filter-tag" onClick={() => setInterestFilter(null)}>Interest: {interestFilter} &times;</span>}
        </div>

        <div className="table-controls">
            <div className="items-per-page-selector">
                <label htmlFor="itemsPerPage">Show:</label>
                <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value="All">All</option>
                </select>
            </div>
            {itemsPerPage !== 'All' && (
                <div className="pagination-controls">
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
                </div>
            )}
        </div>

        <div className="user-list-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.joinDate.toLocaleDateString()}</td>
                  <td>
                    <span className={`user-status-tag ${user.isBlocked ? 'blocked' : 'active'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button className="admin-button secondary" onClick={() => setSelectedUser(user)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserDetailModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onBlockUser={handleBlockUser}
      />
    </div>
  );
}