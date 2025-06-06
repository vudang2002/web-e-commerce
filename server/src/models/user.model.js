import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    storeName: {
      type: String,
    },
    storeDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add a method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Add a method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret";
  return jwt.sign({ id: this._id, role: this.role }, jwtSecret, {
    expiresIn: "1d",
  });
};

const User = mongoose.model("User", userSchema);
export default User;
