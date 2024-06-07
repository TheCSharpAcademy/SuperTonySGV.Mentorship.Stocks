import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute: React.FC = () => {
    const { auth } = useContext(AuthContext);

    return auth.token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
