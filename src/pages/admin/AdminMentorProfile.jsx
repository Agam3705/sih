import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockMentorApplications } from './mockData';
import './AdminMentorProfile.css';
import { MdWork, MdBusiness, MdAccessTime, MdStyle, MdFavorite, MdGroups, MdCheckCircle } from 'react-icons/md';

export default function AdminMentorProfile() {
    const { mentorId } = useParams();
    const navigate = useNavigate();
    const [mentor, setMentor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMentor = () => {
            setIsLoading(true);
            setTimeout(() => {
                const foundMentor = mockMentorApplications.find(m => m.id === mentorId);
                setMentor(foundMentor);
                setIsLoading(false);
            }, 500);
        };
        if (mentorId) fetchMentor();
    }, [mentorId]);

    const handleUpdateStatus = (status) => {
        alert(`(Mock Update) Mentor ${mentor.fullName} has been ${status}.`);
        navigate('/admin/mentors');
    };

    if (isLoading) return <p className="loading-message">Loading mentor profile...</p>;
    if (!mentor) return <p className="loading-message">Mentor not found.</p>;

    const currentStatus = mentor.status || 'pending';

    return (
        <div className="profile-container">
            <Link to="/admin/mentors" className="back-link">← Back to Mentor List</Link>
            <div className="profile-header">
                <img
                    src={mentor.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${mentor.fullName}`}
                    alt={mentor.fullName}
                    className="profile-avatar"
                />
                <div className="profile-header-info">
                    <h1>{mentor.fullName}</h1>
                    <h2>{mentor.jobTitle} at <strong>{mentor.company}</strong></h2>
                    <div className="profile-tags">
                        <span><MdBusiness /> {mentor.industry}</span>
                        <span><MdAccessTime /> {mentor.experience}</span>
                    </div>
                </div>
            </div>
            
            <div className="profile-grid">
                <div className="profile-card"><h3><MdFavorite /> Motivation to Mentor</h3><p>{mentor.motivation}</p></div>
                <div className="profile-card"><h3><MdStyle /> Mentorship Style</h3><p>{mentor.mentorshipStyle}</p></div>
                <div className="profile-card"><h3><MdCheckCircle /> Key Skills</h3><p>{mentor.skills}</p></div>
                <div className="profile-card"><h3><MdWork /> Areas of Expertise</h3><p>{mentor.expertise}</p></div>
                <div className="profile-card"><h3>🏆 Notable Achievements</h3><p>{mentor.achievements}</p></div>
                <div className="profile-card"><h3><MdGroups /> Ideal Mentees</h3><p>{mentor.targetAudience}</p></div>
            </div>

            <div className="profile-actions">
                {/* The "Current Status" text has been removed from here */}
                {currentStatus !== 'approved' && (
                    <button className="approve-btn" onClick={() => handleUpdateStatus('approved')}>
                        Approve Application
                    </button>
                )}
                {currentStatus !== 'rejected' && (
                    <button className="reject-btn" onClick={() => handleUpdateStatus('rejected')}>
                        Reject Application
                    </button>
                )}
                {currentStatus !== 'pending' && (
                    <button className="pending-btn" onClick={() => handleUpdateStatus('pending')}>
                        Set to Pending
                    </button>
                )}
            </div>
        </div>
    );
}