import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // For table support

const guideText = `
# Admin Panel Guide

Welcome to the CareerFlow Admin Panel. This guide provides a complete overview of all the features and tools available to you for managing the platform.

---

## 📊 Dashboard

The **Dashboard** is your main overview of platform activity. It provides at-a-glance statistics and data visualizations.

- **Mentor Application Status:** A chart showing the breakdown of all mentor applications by their status (Pending, Approved, Rejected).
- **Quick Stats:** Key metrics like the total number of users, pending requests, and active events.

---

## 📬 Inbox

The **Inbox** is your central hub for all user-submitted requests. All incoming requests are categorized and can be filtered by their status.

- **Categories:** Filter requests by *Event Submission*, *Open Work Request*, *Bug Report*, or *Report User/Mentor*.
- **Status Filters:** Further filter requests by *Pending*, *Approved*, or *Rejected*.
- **Actions:** Click on any request to open a detailed view where you can:
    - **Approve/Reject:** Change the status of the request.
    - **Reply:** Send a direct message back to the user regarding their submission.
    - **View History:** See a complete history of all replies sent for that request.

---

## 👥 User & Mentor Management

### Manage Users

This section provides tools to oversee the entire user base of the platform.

- **Data Visualization:** Interactive charts show user demographics based on their quiz answers, such as **Educational Status** and **Career Interests**. Clicking on a segment of a chart filters the user list.
- **User List:** A searchable and filterable table of all registered users.
- **Actions:**
    - **View Details:** Click on a user to see their complete profile and all their quiz answers in a pop-up window.
    - **Block/Unblock User:** Admins have the ability to block a user's access to the platform.

### Manage Mentors

This is where you curate the network of mentors available to users.

- **Application Review:** View a list of all users who have applied to become mentors.
- **Filter Applications:** Sort mentor applications by their status (Pending, Approved, Rejected).
- **Approve/Reject:** Approve applications to make the mentor's profile visible to all users, or reject them.

---

## 🚀 Content & Engagement

### Broadcast

The **Broadcast** tool allows you to send rich notifications to specific groups of users.

- **Rich Text Editor:** Craft messages with text styling (bold, lists, etc.).
- **Multi-File Attachments:** Attach multiple images, videos, or audio files to any broadcast. An advanced **Image Editor** is available for cropping and adjustments.
- **Scheduling:** Send a broadcast immediately or schedule it to be published at a future date and time.
- **Manage Scheduled Posts:** View all upcoming scheduled posts, with options to **edit** the content and time or **delete** them.

### Manage Events

This section gives you full control over the events listed on the platform.

- **CRUD Operations:** Create, Read, Update, and Delete events.
- **Event Details:** Add comprehensive details for each event, including title, date, location, description, category, and a promotional image.
- **Image Editor:** Use the built-in image editor to prepare event images.

### Sent History

The **Sent History** page provides a complete log of all non-scheduled broadcasts that have been sent, allowing you to review past communications.

---

## ⚙️ Settings

The **Settings** page allows you to configure your admin account and the platform.

- **Appearance:** Switch the entire admin panel between **Light** and **Dark** themes.
- **Profile Information:** Shows your admin account name and email.
- **Security:** Change your admin account password via a secure modal window.
- **Notification Preferences:** (Mock) Set preferences for receiving administrative notifications.
`;

export default function ReadmeGuidePage() {
    return (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '1px 40px', borderRadius: '12px', color: 'var(--text-primary)' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{guideText}</ReactMarkdown>
        </div>
    );
}