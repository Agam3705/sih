import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockMentorApplications } from './admin/mockData';
// --- 1. Add Firebase imports for functionality ---
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
// ---
import './MentorProfilePage.css';
import { MdWork, MdBusiness, MdAccessTime, MdStyle, MdFavorite, MdGroups, MdCheckCircle } from 'react-icons/md';

export default function MentorProfilePage() {
    const { mentorId } = useParams();
    const [mentor, setMentor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // --- 2. Add state for the current user and request status ---
    const [currentUser, setCurrentUser] = useState(null);
    const [requestStatus, setRequestStatus] = useState('idle'); // idle, loading, pending, accepted

    // Get the currently logged-in user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    // Fetch the mentor's profile data
    useEffect(() => {
        const fetchMentor = () => { // Removed async as setTimeout is not a promise
            setIsLoading(true);
            setTimeout(() => {
                const foundMentor = mockMentorApplications.find(m => m.id === mentorId);
                setMentor(foundMentor);
                setIsLoading(false);
            }, 500);
        };

        if (mentorId) {
            fetchMentor();
        }
    }, [mentorId]);

    // Check if a connection request already exists between the user and mentor
    useEffect(() => {
        if (!currentUser || !mentor) return;

        const checkConnectionStatus = async () => {
            // This part requires a real Firebase connection to work
            try {
                const requestsRef = collection(db, "connectionRequests");
                const q = query(requestsRef, 
                    where("menteeId", "==", currentUser.uid),
                    where("mentorId", "==", mentor.uid)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const requestData = querySnapshot.docs[0].data();
                    setRequestStatus(requestData.status);
                } else {
                    setRequestStatus('idle');
                }
            } catch (error) {
                console.error("Could not check connection status (is Firestore connected?)", error);
                // In a mock environment, we can assume the status is 'idle'
                setRequestStatus('idle');
            }
        };

        checkConnectionStatus();
    }, [currentUser, mentor]);


    // --- 3. Add handler function for the connect button ---
    const handleConnect = async () => {
        if (!currentUser) {
            alert("Please log in to connect with mentors.");
            return;
        }

        setRequestStatus('loading');
        try {
            // This will write to your live Firebase database
            await addDoc(collection(db, "connectionRequests"), {
                menteeId: currentUser.uid,
                menteeName: currentUser.displayName || currentUser.email,
                mentorId: mentor.uid, // mentor.uid comes from our mock data
                mentorName: mentor.fullName,
                status: 'pending',
                createdAt: new Date()
            });
            setRequestStatus('pending');
        } catch (error) {
            console.error("Error sending connection request: ", error);
            alert("Failed to send connection request. Please ensure you are connected to Firebase.");
            setRequestStatus('idle');
        }
    };

    // --- 4. Helper function to get the correct button text ---
    const getButtonText = () => {
        switch(requestStatus) {
            case 'loading': return 'Sending...';
            case 'pending': return 'Request Sent';
            case 'accepted': return 'Connected';
            default: return 'Connect';
        }
    };

    if (isLoading) return <p className="loading-message">Loading mentor profile...</p>;
    if (!mentor) return <p className="loading-message">Mentor not found.</p>;

    return (
        <div className="profile-container">
            <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
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
                {/* --- 5. Update the button to be dynamic --- */}
                <button 
                    className="connect-button"
                    onClick={handleConnect}
                    disabled={requestStatus !== 'idle'}
                >
                    {getButtonText()}
                </button>
            </div>
            
            <div className="profile-grid">
                <div className="profile-card">
                    <h3><MdFavorite /> Motivation to Mentor</h3>
                    <p>{mentor.motivation}</p>
                </div>
                <div className="profile-card">
                    <h3><MdStyle /> Mentorship Style</h3>
                    <p>{mentor.mentorshipStyle}</p>
                </div>
                 <div className="profile-card">
                    <h3><MdCheckCircle /> Key Skills</h3>
                    <p>{mentor.skills}</p>
                </div>
                <div className="profile-card">
                    <h3><MdWork /> Areas of Expertise</h3>
                    <p>{mentor.expertise}</p>
                </div>
                <div className="profile-card">
                    <h3>🏆 Notable Achievements</h3>
                    <p>{mentor.achievements}</p>
                </div>
                <div className="profile-card">
                    <h3><MdGroups /> Ideal Mentees</h3>
                    <p>{mentor.targetAudience}</p>
                </div>
            </div>
        </div>
    );
}