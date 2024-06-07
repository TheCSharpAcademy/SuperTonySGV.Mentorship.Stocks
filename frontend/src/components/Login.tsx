import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/api';
import axios from 'axios';
import './Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login({ email, password });
            const token = response.data.token;
            console.log('Login successful, token:', token); // Debugging
            localStorage.setItem('token', token); // Store token in local storage
            setAuth({ token });
            debugger;
            navigate('/dashboard');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data);
                setError(error.response?.data?.message || 'Login failed. Please try again.');
            } else {
                console.error('Unexpected error:', error);
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Welcome to StockData Downloader.</h2>
            <p>
                This app is built to help you more quickly download data from Polygon.io.
                All you need to do is provide your Polygon.io API key, add some tickers
                and start downloading data.
            </p>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="login-form">
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
            <p className="register-link">
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;
