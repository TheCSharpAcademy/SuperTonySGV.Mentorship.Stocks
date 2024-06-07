import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Stock Data App</h1>
            <p>Please log in or register to continue.</p>
            <Link to="/login"><button>Login</button></Link>
            <Link to="/register"><button>Register</button></Link>
        </div>
    );
};

export default LandingPage;
