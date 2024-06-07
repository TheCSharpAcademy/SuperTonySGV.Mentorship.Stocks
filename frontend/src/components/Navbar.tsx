import React from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsButton from './SettingsButton';
import './Navbar.css';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/dashboard');
    };

    return (
        <header className="navbar-container">
            <nav className="navbar">
                <div className="navbar-content">
                    <button className="home-button" onClick={handleHomeClick}>Dashboard</button>
                    <div className="profile-photo">
                        <SettingsButton />
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
