import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import DatePicker from 'react-datepicker';
import { FaPaperPlane, FaImage, FaVideo, FaVolumeUp, FaCalendarAlt, FaBold, FaItalic, FaStrikethrough, FaListOl, FaListUl, FaQuoteLeft, FaUndo, FaRedo, FaTrash, FaEdit } from 'react-icons/fa';
import ImageEditorModal from './components/ImageEditorModal';
import Notification from '../../components/Notification';
import PostViewModal from './components/PostViewModal';
import './BroadcastPage.css';

// Tiptap Toolbar Component
const MenuBar = ({ editor }) => {
  if (!editor) return null;
  return (
    <div className="tiptap-toolbar">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><FaBold /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><FaItalic /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}><FaStrikethrough /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}><FaListUl /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}><FaListOl /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}><FaQuoteLeft /></button>
      <button type="button" onClick={() => editor.chain().focus().undo().run()}><FaUndo /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()}><FaRedo /></button>
    </div>
  );
};

export default function BroadcastPage() {
    const { scheduledPosts, setScheduledPosts, setSentPosts } = useOutletContext();
    
    const [targetAudience, setTargetAudience] = useState('all');
    const [scheduledDate, setScheduledDate] = useState(null);
    const [notification, setNotification] = useState(null);
    const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
    const [imageToEdit, setImageToEdit] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [viewingPost, setViewingPost] = useState(null);

    const fileInputRef = useRef(null);

    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
        editorProps: { attributes: { class: 'tiptap-editor' } },
    });

    useEffect(() => {
      return () => {
        attachments.forEach(att => {
          if (att.previewUrl && att.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(att.previewUrl);
          }
        });
      };
    }, [attachments]);

    const showTempNotification = (message) => {
        setNotification({ message });
        setTimeout(() => setNotification(null), 4000);
    };
    
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newAttachments = files.map(file => ({
            id: Date.now() + Math.random(),
            file,
            type: file.type.split('/')[0],
            previewUrl: URL.createObjectURL(file)
        }));

        const imageToEditFromFile = newAttachments.find(att => att.type === 'image');
        if (imageToEditFromFile) {
            setImageToEdit(imageToEditFromFile);
            setIsImageEditorOpen(true);
        }
        setAttachments(prev => [...prev, ...newAttachments]);
    };
    
    const handleImageEdited = (editedImageBase64) => {
        setAttachments(prev => prev.map(att => 
            att.id === imageToEdit.id ? { ...att, previewUrl: editedImageBase64 } : att
        ));
        setIsImageEditorOpen(false);
        setImageToEdit(null);
        showTempNotification('Image successfully edited!');
    };

    const handleImageEditorClose = () => {
        setIsImageEditorOpen(false);
        setImageToEdit(null);
    };

    const handleRemoveAttachment = (idToRemove) => {
        setAttachments(prev => prev.filter(att => att.id !== idToRemove));
    };

    const resetForm = () => {
        editor.commands.clearContent();
        setTargetAudience('all');
        setScheduledDate(null);
        setAttachments([]);
        setEditingPostId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmitBroadcast = (e) => {
        e.preventDefault();
        const messageContent = editor.getHTML();

        if (editor.isEmpty && attachments.length === 0) {
            showTempNotification('Broadcast cannot be empty.');
            return;
        }

        const broadcastData = {
            id: editingPostId || Date.now(),
            message: messageContent,
            targetAudience,
            scheduledAt: scheduledDate,
            attachments,
            timestamp: new Date().toISOString(),
        };

        if (scheduledDate) {
            if (editingPostId) {
                setScheduledPosts(prev => prev.map(p => p.id === editingPostId ? broadcastData : p));
                showTempNotification(`Broadcast updated for ${scheduledDate.toLocaleString()}`);
            } else {
                setScheduledPosts(prev => [...prev, broadcastData].sort((a,b) => a.scheduledAt - b.scheduledAt));
                showTempNotification(`Broadcast scheduled for ${scheduledDate.toLocaleString()}`);
            }
        } else {
            // ==================================================================
            // === THIS IS THE FIX: This line was missing =======================
            // ==================================================================
            setSentPosts(prev => [...prev, broadcastData]);
            console.log('Broadcasting Now:', broadcastData);
            showTempNotification(`Broadcast sent!`);
        }
        resetForm();
    };

    const handleEditScheduledPost = (postToEdit) => {
        editor.commands.setContent(postToEdit.message);
        setTargetAudience(postToEdit.targetAudience);
        setScheduledDate(postToEdit.scheduledAt);
        setAttachments(postToEdit.attachments);
        setEditingPostId(postToEdit.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteScheduledPost = (idToDelete) => {
        setScheduledPosts(prev => prev.filter(p => p.id !== idToDelete));
        showTempNotification("Scheduled post deleted.");
    };

    return (
        <div className="broadcast-page">
            <Notification
                show={!!notification}
                message={notification?.message || ''}
            />
            <h1 className="broadcast-page-title">Create New Broadcast</h1>

            <form onSubmit={handleSubmitBroadcast} className="broadcast-form">
                <div className="form-group">
                    <label htmlFor="audience">Target Audience:</label>
                    <select id="audience" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}>
                        <option value="users">All Users</option>
                        <option value="all_mentors">All Mentors</option>
                        <option value="approved_mentors">Approved Mentors</option>
                        <option value="pending_mentors">PendingMentors</option>
                        <option value="rejected_mentors">Rejected Mentors</option>
                        <option value="everyone">Everyone</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Message Content:</label>
                    <div className="tiptap-container">
                        <MenuBar editor={editor} />
                        <EditorContent editor={editor} />
                    </div>
                </div>

                <div className="media-attachments-section">
                    <label className="attachment-label">Attachments</label>
                    <div className="attachment-preview-grid">
                        {attachments.map(att => (
                            <div key={att.id} className="attachment-preview-card">
                                {att.type === 'image' && <img src={att.previewUrl} alt="preview" />}
                                {att.type === 'video' && <video src={att.previewUrl} controls />}
                                {att.type === 'audio' && <audio src={att.previewUrl} controls />}
                                <span>{att.file.name}</span>
                                <button type="button" className="remove-attachment-btn" onClick={() => handleRemoveAttachment(att.id)}>&times;</button>
                            </div>
                        ))}
                    </div>
                    <div className="attachment-buttons">
                        <input type="file" onChange={handleFileChange} multiple style={{ display: 'none' }} ref={fileInputRef} id="upload-files"/>
                        <label htmlFor="upload-files" className="attachment-button"><FaImage /> Add Files</label>
                    </div>
                </div>

                <div className="form-group scheduling-group">
                    <label className="scheduling-label"><FaCalendarAlt /> Schedule Post:</label>
                    <div className="date-picker-wrapper">
                        <DatePicker
                            selected={scheduledDate}
                            onChange={(date) => setScheduledDate(date)}
                            showTimeSelect
                            dateFormat="Pp"
                            placeholderText="Optional: Schedule for later"
                            className="date-picker-input"
                            minDate={new Date()}
                        />
                    </div>
                    {scheduledDate && (
                        <button type="button" onClick={() => setScheduledDate(null)} className="clear-schedule-button">Clear</button>
                    )}
                </div>

                <button type="submit" className="send-broadcast-button">
                    <FaPaperPlane /> {editingPostId ? 'Update Schedule' : (scheduledDate ? 'Schedule Broadcast' : 'Send Broadcast Now')}
                </button>
                {editingPostId && (
                    <button type="button" onClick={resetForm} className="cancel-edit-btn">Cancel Edit</button>
                )}
            </form>

            {scheduledPosts.length > 0 && (
                <div className="scheduled-posts-section">
                    <h2>Scheduled Posts</h2>
                    <div className="scheduled-posts-list">
                        {scheduledPosts.map(post => (
                            <div key={post.id} className="scheduled-post-card">
                                <div className="scheduled-post-details" onClick={() => setViewingPost(post)}>
                                    <p><strong>To:</strong> {post.targetAudience.charAt(0).toUpperCase() + post.targetAudience.slice(1)}</p>
                                    <p><strong>Scheduled for:</strong> {post.scheduledAt.toLocaleString()}</p>
                                    <div className="scheduled-post-content">
                                        {post.message.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                    </div>
                                </div>
                                <div className="scheduled-post-actions">
                                    <button onClick={() => handleEditScheduledPost(post)} className="edit-btn"><FaEdit /> Edit</button>
                                    <button onClick={() => handleDeleteScheduledPost(post.id)} className="delete-btn"><FaTrash /> Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ImageEditorModal
                src={imageToEdit?.previewUrl}
                isOpen={isImageEditorOpen}
                onClose={handleImageEditorClose}
                onSave={handleImageEdited}
            />
            
            <PostViewModal post={viewingPost} onClose={() => setViewingPost(null)} />
        </div>
    );
}