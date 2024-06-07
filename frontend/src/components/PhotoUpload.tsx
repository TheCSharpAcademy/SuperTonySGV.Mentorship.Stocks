import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PhotoUpload: React.FC = () => {
    const [photo, setPhoto] = useState<string | null>(null);
    const navigate = useNavigate();

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = () => {
        navigate('/profile');
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} id="photo-upload" />
            <label htmlFor="photo-upload">
                {photo ? (
                    <img src={photo} alt="User Photo" onClick={handleClick} style={{ cursor: 'pointer', width: '100px', height: '100px', objectFit: 'cover' }} />
                ) : (
                    <button>Upload Photo</button>
                )}
            </label>
        </div>
    );
};

export default PhotoUpload;
