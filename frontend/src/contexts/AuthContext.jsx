import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            apiClient.get('/user')
                .then(response => {
                    setUser(response.data);
                })
                .catch(() => {
                    // Token tidak valid, hapus dari local storage
                    localStorage.removeItem('token');
                    setToken(null);
                    delete apiClient.defaults.headers.common['Authorization'];
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (credentials) => {
        const response = await apiClient.post('/login', credentials);
        const { access_token, user } = response.data;
        localStorage.setItem('token', access_token);
        setToken(access_token);
        setUser(user);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    };

    const register = async (data) => {
        await apiClient.post('/register', data);
    };

    const logout = async () => {
        try {
            await apiClient.post('/logout');
        } catch (error) {
            console.error("Logout failed, possibly due to invalid token on server. Clearing client-side session.", error);
        } finally {
            // Selalu hapus data di sisi client, apapun respons server
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            delete apiClient.defaults.headers.common['Authorization'];
        }
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
    };

    // Tampilkan loading spinner jika sedang memeriksa token
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
