import * as userService from "../services/user.service.js";
import { formatResponse } from "../utils/response.util.js";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/daoxcmuum/image/upload/v1747379207/avatar_default_ete63o.jpg";

export const registerUser = async (req, res) => {
  try {
    // Log để debug
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    // Xử lý dữ liệu từ form/request
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || "user",
    };

    // Xử lý boolean từ FormData (FormData gửi string "true"/"false" thay vì boolean)
    if (req.body.isSeller !== undefined) {
      userData.isSeller =
        req.body.isSeller === "true" || req.body.isSeller === true;
    }

    // Thêm thông tin cửa hàng nếu là seller
    if (userData.isSeller) {
      userData.storeName = req.body.storeName;
      userData.storeDescription = req.body.storeDescription || "";
    }

    // Xử lý avatar từ multer
    if (req.file) {
      // Cloudinary trả về URL trong các trường khác nhau tùy theo cấu hình
      userData.avatar = req.file.path || req.file.secure_url || req.file.url;
      console.log("Avatar URL:", userData.avatar);
    } else if (!req.body.avatar) {
      userData.avatar = DEFAULT_AVATAR;
    }

    // Validate dữ liệu trước khi tạo
    if (!userData.name) {
      return res.status(400).json(formatResponse(false, "Name is required"));
    }
    if (!userData.email) {
      return res.status(400).json(formatResponse(false, "Email is required"));
    }
    if (!userData.password) {
      return res
        .status(400)
        .json(formatResponse(false, "Password is required"));
    }
    if (userData.isSeller && !userData.storeName) {
      return res
        .status(400)
        .json(formatResponse(false, "Store name is required for sellers"));
    }

    console.log("Creating user with data:", userData);

    const user = await userService.createUser(userData);
    res
      .status(201)
      .json(formatResponse(true, "User registered successfully", user));
  } catch (error) {
    console.error("Error creating user:", error);
    // Xử lý lỗi MongoDB unique email
    if (error.code === 11000) {
      return res
        .status(400)
        .json(formatResponse(false, "Email already exists"));
    }
    res
      .status(400)
      .json(formatResponse(false, error.message || "Error creating user"));
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

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await userService.updateUser(userId, updateData);
    if (!user) {
      return res.status(404).json(formatResponse(false, "User not found"));
    }

    // Remove password from response - handle both Mongoose document and plain object
    let userWithoutPassword;
    if (user.toObject) {
      const { password, ...rest } = user.toObject();
      userWithoutPassword = rest;
    } else {
      const { password, ...rest } = user;
      userWithoutPassword = rest;
    }

    res.status(200).json(
      formatResponse(true, "Profile updated successfully", {
        user: userWithoutPassword,
      })
    );
  } catch (error) {
    console.error("Profile update error:", error);
    res
      .status(500)
      .json(formatResponse(false, "Profile update failed. Please try again."));
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json(
          formatResponse(
            false,
            "Current password and new password are required"
          )
        );
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json(
          formatResponse(
            false,
            "New password must be at least 6 characters long"
          )
        );
    }

    const result = await userService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    res.status(200).json(formatResponse(true, "Password changed successfully"));
  } catch (error) {
    if (error.message === "Current password is incorrect") {
      return res
        .status(400)
        .json(formatResponse(false, "Mật khẩu hiện tại không đúng"));
    }
    res.status(400).json(formatResponse(false, error.message));
  }
};
