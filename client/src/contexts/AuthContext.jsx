import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getCurrentUser,
  logout,
  updateProfile as updateProfileService,
  changePassword,
} from "../services/authService";
import { useNavigate } from "react-router-dom";

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login function - can be used by login forms
  const loginUser = (userData) => {
    setUser(userData);
  };

  // Logout function
  const logoutUser = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === "admin";
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    const updatedUser = await updateProfileService(profileData);
    setUser(updatedUser);
    return updatedUser;
  };

  // Change password function
  const changeUserPassword = async (passwordData) => {
    const result = await changePassword(passwordData);
    return result;
  };

  // Context value
  const value = {
    user,
    loading,
    loginUser,
    logoutUser,
    isAdmin,
    updateProfile,
    changePassword: changeUserPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
