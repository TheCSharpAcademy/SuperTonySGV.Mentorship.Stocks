import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TokenCheck: React.FC = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !auth.token) {
            setAuth({ token });
            navigate('/dashboard');
        }
    }, [auth.token, setAuth, navigate]);

    return null;
};

export default TokenCheck;
