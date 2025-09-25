import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import { FaTimes, FaCrop, FaMagic, FaSlidersH, FaUndo, FaRedo } from 'react-icons/fa';
import './ImageEditorModal.css';

function ImageEditorModal({ src, isOpen, onClose, onSave }) {
    const cropperRef = useRef(null);
    const [currentTab, setCurrentTab] = useState('crop');
    const [aspectRatio, setAspectRatio] = useState('original');
    
    // Mock states for filter/adjust
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);

    useEffect(() => {
        if (!isOpen) {
            setAspectRatio('original');
            setBrightness(100);
            setContrast(100);
            setSaturation(100);
        }
    }, [isOpen]);

    const handleSave = () => {
        if (cropperRef.current && cropperRef.current.cropper) {
            const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
            if (!croppedCanvas) {
                onSave(src); // No crop data, return original
                return;
            }
            onSave(croppedCanvas.toDataURL());
        }
    };

    const setCropperAspectRatio = (ratio) => {
        const cropper = cropperRef.current?.cropper;
        if (!cropper) return;
        
        let newRatio = NaN; // Free ratio
        if (ratio === 'square') newRatio = 1;
        if (ratio === '4:3') newRatio = 4 / 3;
        if (ratio === '16:9') newRatio = 16 / 9;
        
        cropper.setAspectRatio(newRatio);
        setAspectRatio(ratio);
    };

    if (!isOpen) return null;

    return (
        <div className="image-editor-modal-overlay" onClick={onClose}>
            <div className="image-editor-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="image-editor-header">
                    <span>Edit Image</span>
                    <button onClick={onClose} className="image-editor-close-btn"><FaTimes /></button>
                </div>

                <div className="image-editor-body">
                    <div className="image-editor-main-panel">
                        <Cropper
                            ref={cropperRef}
                            src={src}
                            style={{ height: '100%', width: '100%', filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` }}
                            viewMode={1}
                            background={false}
                            responsive={true}
                            autoCropArea={1}
                            guides={true}
                        />
                    </div>

                    <div className="image-editor-controls-panel">
                        <div className="image-editor-tabs">
                            <button className={`image-editor-tab-button ${currentTab === 'crop' ? 'active' : ''}`} onClick={() => setCurrentTab('crop')}><FaCrop /> Crop</button>
                            <button className={`image-editor-tab-button ${currentTab === 'filter' ? 'active' : ''}`} onClick={() => setCurrentTab('filter')}><FaMagic /> Filter</button>
                            <button className={`image-editor-tab-button ${currentTab === 'adjust' ? 'active' : ''}`} onClick={() => setCurrentTab('adjust')}><FaSlidersH /> Adjust</button>
                        </div>

                        <div className="image-editor-tab-content">
                            {currentTab === 'crop' && (
                                <div>
                                    <label>Aspect Ratio</label>
                                    <div className="aspect-ratio-buttons">
                                        {['original', 'square', '4:3', '16:9'].map(ratio => (
                                            <button key={ratio} className={aspectRatio === ratio ? 'active' : ''} onClick={() => setCropperAspectRatio(ratio)}>{ratio.charAt(0).toUpperCase() + ratio.slice(1)}</button>
                                        ))}
                                    </div>
                                    <label>Transform</label>
                                    <div>
                                        <button onClick={() => cropperRef.current?.cropper.rotate(-90)}><FaUndo /></button>
                                        <button onClick={() => cropperRef.current?.cropper.rotate(90)}><FaRedo /></button>
                                    </div>
                                </div>
                            )}

                            {currentTab === 'filter' && (
                                <div>
                                    <label>Choose Filter (UI Only)</label>
                                    <button>Grayscale</button>
                                    <button>Sepia</button>
                                    <button>Vintage</button>
                                </div>
                            )}

                            {currentTab === 'adjust' && (
                                <div>
                                    <label>Brightness: {brightness}%</label>
                                    <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
                                    <label>Contrast: {contrast}%</label>
                                    <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} />
                                    <label>Saturation: {saturation}%</label>
                                    <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="image-editor-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button onClick={handleSave}>Apply</button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditorModal; // <-- FIX: Added the 'default' keyword here