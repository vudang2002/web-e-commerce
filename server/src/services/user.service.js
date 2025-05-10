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
