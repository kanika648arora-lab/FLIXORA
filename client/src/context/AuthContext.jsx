import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { userProfiles } from '../data/moviesData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('flixora_token') || 'demo_token_vaibhav');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('flixora_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-01',
      name: 'Vaibhav',
      email: 'vaibhav@flixora.com',
      activeProfile: 'prof-1'
    };
  });
  const [activeProfile, setActiveProfile] = useState(() => {
    const profileId = user?.activeProfile || 'prof-1';
    return userProfiles.find(p => p.id === profileId) || userProfiles[0];
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('flixora_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('flixora_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('flixora_token', token);
    } else {
      localStorage.removeItem('flixora_token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        const profile = userProfiles.find(p => p.id === res.user.activeProfile) || userProfiles[0];
        setActiveProfile(profile);
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch {
      // Local fallback login for offline reliability
      const demoUser = {
        id: 'usr-01',
        name: email.split('@')[0] || 'Vaibhav',
        email,
        activeProfile: 'prof-1'
      };
      setToken('demo_token');
      setUser(demoUser);
      setActiveProfile(userProfiles[0]);
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.register(name, email, password);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        setActiveProfile(userProfiles[0]);
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch {
      const newUser = {
        id: `usr-${Date.now()}`,
        name,
        email,
        activeProfile: 'prof-1'
      };
      setToken(`token-${Date.now()}`);
      setUser(newUser);
      setActiveProfile(userProfiles[0]);
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const demoLogin = () => {
    const demoUser = {
      id: 'usr-01',
      name: 'Vaibhav',
      email: 'vaibhav@flixora.com',
      activeProfile: 'prof-1'
    };
    setToken('demo_token_vaibhav');
    setUser(demoUser);
    setActiveProfile(userProfiles[0]);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('flixora_token');
    localStorage.removeItem('flixora_user');
  };

  const switchProfile = (profileId) => {
    const target = userProfiles.find(p => p.id === profileId);
    if (target) {
      setActiveProfile(target);
      if (user) {
        setUser({ ...user, activeProfile: profileId });
      }
      setIsProfileSelectorOpen(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      activeProfile,
      login,
      register,
      demoLogin,
      logout,
      switchProfile,
      profiles: userProfiles,
      isAuthModalOpen,
      setIsAuthModalOpen,
      isProfileSelectorOpen,
      setIsProfileSelectorOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
