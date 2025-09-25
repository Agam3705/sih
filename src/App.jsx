import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; // Assuming firebase config is in ./firebase
import { doc, getDoc } from "firebase/firestore";

// --- Layout & General Components ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import LoadingScreen from "./components/LoadingScreen";
import AdminLayout from "./components/AdminLayout"; // Layout for the admin panel

// --- Page Components (User Facing) ---
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import QuizPage from "./pages/QuizPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import MentorProfilePage from "./pages/MentorProfilePage";
import ContactAdminPage from "./pages/ContactAdminPage";

// --- Page Components (Admin Facing) ---
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import InboxPage from "./pages/admin/InboxPage";
import ManageMentorsPage from "./pages/admin/ManageMentorsPage";
import AdminMentorProfile from "./pages/admin/AdminMentorProfile";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import BroadcastPage from "./pages/admin/BroadcastPage";
import ManageEventsPage from "./pages/admin/ManageEventsPage";
import SentHistoryPage from "./pages/admin/SentHistoryPage";
import ReadmeGuidePage from "./pages/admin/ReadmeGuidePage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

// --- CSS Imports ---
import "./App.css";
import "./HomePage.css";

/**
 * Route Guard: This component protects routes. It ensures that a user is:
 * 1. Logged in.
 * 2. Has completed the initial quiz.
 * If either condition is false, it redirects the user appropriately.
 */
function RequireQuizCompleted({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate("/login");
        setLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().quizCompleted) {
          setIsAllowed(true);
        } else {
          navigate("/quiz");
        }
      } catch (err) {
        console.error("Error checking user quiz status:", err);
        navigate("/quiz"); // Redirect on error
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  return isAllowed ? children : null;
}

export default function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <HeroSection />
            <Footer />
          </>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<AuthPage type="signup" />} />
      <Route path="/quiz" element={<QuizPage />} />

      {/* --- Protected User Routes (Require Quiz Completion) --- */}
      <Route
        path="/dashboard"
        element={
          <RequireQuizCompleted>
            <Dashboard />
          </RequireQuizCompleted>
        }
      />
      <Route
        path="/chat/:chatId"
        element={
          <RequireQuizCompleted>
            <ChatPage />
          </RequireQuizCompleted>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireQuizCompleted>
            <SettingsPage />
          </RequireQuizCompleted>
        }
      />
       <Route
        path="/profile"
        element={
          <RequireQuizCompleted>
            <ProfilePage />
          </RequireQuizCompleted>
        }
      />
      <Route
        path="/mentor/:mentorId"
        element={
          <RequireQuizCompleted>
            <MentorProfilePage />
          </RequireQuizCompleted>
        }
      />
      <Route
        path="/contact-admin"
        element={
          <RequireQuizCompleted>
            <ContactAdminPage />
          </RequireQuizCompleted>
        }
      />

      {/* --- Admin Routes (Nested under AdminLayout) --- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="inbox" element={<InboxPage />} />
        <Route path="mentors" element={<ManageMentorsPage />} />
        <Route path="mentor/:mentorId" element={<AdminMentorProfile />} />
        <Route path="users" element={<ManageUsersPage />} />
        <Route path="broadcast" element={<BroadcastPage />} />
        <Route path="events" element={<ManageEventsPage />} />
        <Route path="history" element={<SentHistoryPage />} />
        <Route path="guide" element={<ReadmeGuidePage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}