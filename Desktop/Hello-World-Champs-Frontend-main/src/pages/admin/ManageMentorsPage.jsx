import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. IMPORT useNavigate
import { mockMentorApplications } from './mockData';
import MentorStatusChart from './components/MentorStatusChart';
import './Admin.css';

export default function ManageMentorsPage() {
    const [allMentors, setAllMentors] = useState([]);
    const [filterStatus, setFilterStatus] = useState('pending');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); // <-- 2. INITIALIZE useNavigate

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setAllMentors(mockMentorApplications);
            setIsLoading(false);
        }, 500);
    }, []);

    const handleUpdateStatus = (id, newStatus) => {
        alert(`(Mock Update) Mentor ${id} status changed to ${newStatus}.`);
        setAllMentors(currentMentors =>
            currentMentors.map(m => m.id === id ? { ...m, status: newStatus } : m)
        );
    };

    const handleChartClick = (status) => {
        setFilterStatus(status);
    };

    // --- 3. NEW NAVIGATION HANDLER ---
    const handleNavigate = (id) => {
        navigate(`/admin/mentor/${id}`);
    };
    
    const displayedMentors = useMemo(() => {
        return allMentors.filter(m => (m.status || 'pending') === filterStatus);
    }, [allMentors, filterStatus]);

    if (isLoading) return <p>Loading mentor data...</p>;

    return (
        <div>
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
                <h2>Mentor Application Status</h2>
                <div style={{ maxWidth: '400px', margin: '20px auto', padding: '1.5rem' }}>
                    <MentorStatusChart mentors={allMentors} onSliceClick={handleChartClick} />
                </div>
            </div>

            <div className="admin-card">
                <h2>
                    Showing <span style={{ textTransform: 'capitalize' }}>{filterStatus}</span> Applications ({displayedMentors.length})
                </h2>
                {displayedMentors.length > 0 ? (
                    <div className="mentor-list">
                        {displayedMentors.map(app => (
                            // --- 4. UPDATED JSX STRUCTURE ---
                            <div key={app.id} className="mentor-item" onClick={() => handleNavigate(app.id)}>
                                <div className="mentor-info">
                                    {/* Link component is removed from here */}
                                    <strong>{app.fullName}</strong> ({app.jobTitle} at {app.company})
                                </div>
                                <div className="mentor-actions">
                                    {/* Buttons now stop the click from propagating to the parent div */}
                                    {(app.status || 'pending') !== 'approved' && (
                                        <button className="approve-btn" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(app.id, 'approved'); }}>
                                            Approve
                                        </button>
                                    )}
                                    {(app.status || 'pending') !== 'rejected' && (
                                        <button className="reject-btn" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(app.id, 'rejected'); }}>
                                            Reject
                                        </button>
                                    )}
                                    {(app.status || 'pending') !== 'pending' && (
                                        <button className="pending-btn" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(app.id, 'pending'); }}>
                                            Set to Pending
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No applications found with this status.</p>
                )}
            </div>
        </div>
    );
}