import * as userService from "../services/user.service.js";
import { formatResponse } from "../utils/response.util.js";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/daoxcmuum/image/upload/v1747379207/avatar_default_ete63o.jpg";

export const registerUser = async (req, res) => {
  try {
    // Nếu không có avatar, gán mặc định
    if (!req.body.avatar) {
      req.body.avatar = DEFAULT_AVATAR;
    }
    const user = await userService.createUser(req.body);
    res
      .status(201)
      .json(formatResponse(true, "User registered successfully", user));
  } catch (error) {
    res.status(400).json(formatResponse(false, error.message));
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.body.email);
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res
        .status(401)
        .json(formatResponse(false, "Invalid email or password"));
    }
    const token = user.generateAuthToken();
    res
      .status(200)
      .json(formatResponse(true, "Login successful", { user, token }));
  } catch (error) {
    res.status(400).json(formatResponse(false, error.message));
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res
      .status(200)
      .json(formatResponse(true, "Users retrieved successfully", users));
  } catch (error) {
    res.status(400).json(formatResponse(false, error.message));
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json(formatResponse(false, "User not found"));
    }
    res
      .status(200)
      .json(formatResponse(true, "User retrieved successfully", user));
  } catch (error) {
    res.status(400).json(formatResponse(false, error.message));
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json(formatResponse(false, "User not found"));
    }
    res
      .status(200)
      .json(formatResponse(true, "User updated successfully", user));
  } catch (error) {
    res.status(400).json(formatResponse(false, error.message));
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json(formatResponse(false, "User not found"));
    }
    res.status(200).json(formatResponse(true, "User deleted successfully"));
  } catch (error) {
    res.status(400).json(formatResponse(false, error.message));
  }
};
