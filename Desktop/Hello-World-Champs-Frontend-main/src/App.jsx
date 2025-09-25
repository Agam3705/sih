import React from "react";
import { Routes, Route } from "react-router-dom";

// User-facing components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/SettingsPage";
import MentorProfilePage from "./pages/MentorProfilePage";
import ContactAdminPage from "./pages/ContactAdminPage";

// Admin-facing components
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ManageMentorsPage from "./pages/admin/ManageMentorsPage";
import BroadcastPage from "./pages/admin/BroadcastPage";
import ReadmeGuidePage from "./pages/admin/ReadmeGuidePage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminMentorProfile from "./pages/admin/AdminMentorProfile";
import SentHistoryPage from "./pages/admin/SentHistoryPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ManageEventsPage from "./pages/admin/ManageEventsPage";
import InboxPage from "./pages/admin/InboxPage";

import "./HomePage.css";

export default function App() {
  return (
    <Routes>
      {/* Homepage */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <main className="main-hero">
              <section className="hero-content">
                <div className="hero-overline">MORE THAN AN AI CAREER ADVISOR</div>
                <h1 className="hero-heading">
                  Discover your<br />
                  perfect career path
                </h1>
                <p className="hero-subtext">
                  With our AI-powered platform, you can explore, analyze, and optimize your career journey.
                  Get personalized guidance, skill gap analysis, and curated resources—built just for Indian students.
                </p>
                <a href="/signup" className="hero-btn">Start building</a>
              </section>
            </main>
            <Footer />
          </>
        }
      />

      {/* User Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<AuthPage type="signup" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat/:chatId" element={<ChatPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/mentor/:mentorId" element={<MentorProfilePage />} />
      <Route path="/contact-admin" element={<ContactAdminPage />} />

      {/* Admin Routes */}
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