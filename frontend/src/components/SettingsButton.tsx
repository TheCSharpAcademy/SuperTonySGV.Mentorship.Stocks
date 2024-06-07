import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './SettingsButton.css';

const SettingsButton: React.FC = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="settings-button-container">
            {isAuthenticated && (
                <>
                    <button className="settings-button" onClick={toggleMenu}>
                        <div className="profile-circle">U</div>
                    </button>
                    {isOpen && (
                        <ul className="settings-menu">
                            <li><Link to="/profile">Profile</Link></li>
                            <li><Link to="/help">Help</Link></li>
                            <li><button onClick={() => {
                                localStorage.removeItem('token');
                                window.location.reload();
                            }}>Logout</button></li>
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default SettingsButton;
