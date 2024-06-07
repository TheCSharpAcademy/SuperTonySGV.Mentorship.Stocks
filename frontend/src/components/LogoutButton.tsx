import React from 'react';
import { logout } from '../services/auth';

const LogoutButton: React.FC = () => {
    return (
        <button onClick={logout}>Logout</button>
    );
};

export default LogoutButton;
