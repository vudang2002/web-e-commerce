import User from "../models/user.model.js";

export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const getUserById = async (id) => {
  return await User.findById(id);
};

export const getAllUsers = async () => {
  return await User.find();
};

export const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Check if current password is correct
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  // Update password (will be hashed by pre-save middleware)
  user.password = newPassword;
  await user.save();

  return { success: true };
};
