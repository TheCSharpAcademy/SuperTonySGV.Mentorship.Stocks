import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/api';

const Profile: React.FC = () => {
    const { auth } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [polygonApiKey, setPolygonApiKey] = useState('');
    const [setRequestLimit, setSetRequestLimit] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile(auth.token!);
                debugger;
                setEmail(response.data.email);
                setPolygonApiKey(response.data.polygonApiKey);
                setSetRequestLimit(response.data.setRequestLimit);
                setLoading(false);
            } catch (error) {
                setError('Failed to load profile');
                setLoading(false);
            }
        };

        fetchProfile();
    }, [auth.token]);

    const handleSave = async () => {
        try {
            await updateProfile({ email, polygonApiKey, setRequestLimit }, auth.token!);
            setError('');
        } catch (error) {
            setError('Failed to update profile');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Polygon API Key</label>
                <input
                    type="text"
                    value={polygonApiKey}
                    onChange={(e) => setPolygonApiKey(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        checked={setRequestLimit}
                        onChange={(e) => setSetRequestLimit(e.target.checked)}
                    />
                    Set Request Limit
                </label>
                <p className="hint">
                    The free Polygon plan has a 5 download per minute limit.<br />
                    Sign up for one of their paid plans to skip the limits and disable this checkbox.
                </p>
            </div>
            <button onClick={handleSave} disabled={!email || !polygonApiKey}>Save</button>
        </div>
    );
};

export default Profile;
