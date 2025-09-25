import React, { useState, useRef } from 'react';
import { mockEvents } from './mockEvents';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaImage, FaTrashAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import ImageEditorModal from './components/ImageEditorModal';
import './ManageEventsPage.css';

const initialFormState = {
  title: '',
  date: new Date(),
  location: '',
  description: '',
  category: 'Workshop',
  image: null,
};

export default function ManageEventsPage() {
  const [events, setEvents] = useState(mockEvents);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToEdit(reader.result);
        setIsImageEditorOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageEdited = (editedImageBase64) => {
    setFormData(prev => ({ ...prev, image: editedImageBase64 }));
    setIsImageEditorOpen(false);
    setImageToEdit(null);
  };

  const handleRemoveImage = () => {
      setFormData(prev => ({ ...prev, image: null }));
      if(fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setEvents(events.map(evt => evt.id === editingId ? { ...formData, id: editingId } : evt));
      alert('Event updated successfully!');
    } else {
      const newEvent = { ...formData, id: `evt${Date.now()}` };
      setEvents(prev => [...prev, newEvent]);
      alert('Event added successfully!');
    }
    setFormData(initialFormState);
    setEditingId(null);
    setIsFormVisible(false);
  };

  const handleEdit = (eventToEdit) => {
    setFormData({ ...eventToEdit });
    setEditingId(eventToEdit.id);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (idToDelete) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(evt => evt.id !== idToDelete));
      alert('Event deleted.');
    }
  };

  const openNewForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsFormVisible(true);
  };

  return (
    <div className="manage-events-page">
      <div className="page-header">
        <h1>Manage Events</h1>
        {!isFormVisible && (
          <button className="add-new-btn" onClick={openNewForm}><FaPlus /> Add New Event</button>
        )}
      </div>

      {isFormVisible && (
        <div className="event-form-container">
          <h2>{editingId ? 'Edit Event' : 'Create New Event'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="title">Event Title</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-group full-width">
                <label htmlFor="location">Location / URL</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date and Time</label>
                <DatePicker
                  selected={formData.date}
                  onChange={handleDateChange}
                  showTimeSelect
                  dateFormat="Pp"
                  className="date-picker-input"
                  minDate={new Date()}
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange}>
                  <option>Workshop</option>
                  <option>Hackathon</option>
                  <option>Seminar</option>
                  <option>Cultural</option>
                </select>
              </div>
               <div className="form-group full-width">
                <label>Event Image</label>
                 <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} style={{display: 'none'}} id="event-image-upload" />
                 <button type="button" className="upload-btn" onClick={() => fileInputRef.current.click()}><FaImage /> {formData.image ? 'Change Image' : 'Upload Image'}</button>
                 {formData.image && (
                    <div className="image-preview">
                        <img src={formData.image} alt="Event preview"/>
                        <button type="button" className="remove-image-btn" onClick={handleRemoveImage}><FaTrashAlt /></button>
                    </div>
                 )}
              </div>
              <div className="form-group full-width">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="action-btn save-btn">{editingId ? 'Update Event' : 'Save Event'}</button>
              <button type="button" className="action-btn cancel-btn" onClick={() => setIsFormVisible(false)}><FaTimes /> Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="events-list-container">
        {events.map(event => (
          <div key={event.id} className="event-card">
            {event.image && <img src={event.image} alt={event.title} className="event-card-image" />}
            <div className="event-card-content">
                <div className="event-details">
                    <span className="event-category-tag">{event.category}</span>
                    <h3>{event.title}</h3>
                    <p><strong>Date:</strong> {event.date.toLocaleString()}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                </div>
                <div className="event-actions">
                    <button className="edit-btn" onClick={() => handleEdit(event)}><FaEdit /> Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(event.id)}><FaTrash /> Delete</button>
                </div>
            </div>
          </div>
        ))}
      </div>
      
      <ImageEditorModal
        src={imageToEdit}
        isOpen={isImageEditorOpen}
        onClose={() => setIsImageEditorOpen(false)}
        onSave={handleImageEdited}
      />
    </div>
  );
}