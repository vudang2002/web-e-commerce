import axiosClient from "../utils/axiosClient";

export const login = async (data) => {
  const response = await axiosClient.post("/auth/login", data);
  if (response && response.data) {
    const { token, user } = response.data;

    // Save token and user info to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  }
  throw new Error("Login failed. Please try again.");
};

export const getCurrentUser = () => {
  try {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    return null;
  }
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === "admin";
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const register = async (data) => {
  const response = await axiosClient.post("/auth/register", data);
  if (response && response.data) {
    const { token, user } = response.data;

    // Save token and user info to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  }
  throw new Error("Registration failed. Please try again.");
};

export const updateProfile = async (data) => {
  const response = await axiosClient.put("/auth/profile", data);
  if (response && response.data) {
    // Handle both success response formats
    const updatedUser =
      response.data.data?.user || response.data.user || response.data;

    // Update user info in localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    return updatedUser;
  }
  throw new Error("Profile update failed. Please try again.");
};

export const changePassword = async (data) => {
  const response = await axiosClient.put("/auth/change-password", data);
  if (response && response.data) {
    return response.data;
  }
  throw new Error("Password change failed. Please try again.");
};
