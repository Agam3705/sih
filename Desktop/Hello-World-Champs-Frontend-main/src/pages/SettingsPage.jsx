import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Re-use styles

export default function SettingsPage() {
    const auth = getAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setDisplayName(currentUser.displayName || '');
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [auth, navigate]);
    
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(auth.currentUser, { displayName });
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            setMessage('Please fill in both current and new password fields.');
            return;
        }
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            setMessage('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };
    
    if (!user) return <p>Loading...</p>;

    return (
        <div style={{ padding: '20px 40px', maxWidth: '800px', margin: 'auto' }}>
            <h1 style={{color: '#232945'}}>Settings</h1>
            
            {message && <p style={{ color: message.startsWith('Error') ? 'red' : 'green' }}>{message}</p>}

            <div className="dashboard-card" style={{ marginBottom: '20px' }}>
                <h2>Update Profile</h2>
                <form onSubmit={handleProfileUpdate}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Display Name:</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        />
                    </div>
                    <button type="submit" className="dashboard-login-btn">Update Profile</button>
                </form>
            </div>

            <div className="dashboard-card">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordUpdate}>
                     <div style={{ marginBottom: '1rem' }}>
                        <label>Current Password:</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>New Password:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        />
                    </div>
                    <button type="submit" className="dashboard-login-btn">Change Password</button>
                </form>
            </div>
        </div>
    );
}