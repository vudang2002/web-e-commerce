import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import TextInput from "../../components/auth/form/TextInput";
import PasswordInput from "../../components/auth/form/PasswordInput";
import { login } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";
  const { loginUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const onSubmit = async (data) => {
    try {
      const user = await login(data);

      // Check if user has admin role
      if (user.role === "admin") {
        // Store user in AuthContext
        loginUser(user);
        // Redirect to the page they were trying to access
        navigate(from, { replace: true });
      } else {
        setErrorMessage("You don't have permission to access admin panel");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-6">Admin Login</h2>
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <TextInput
              label="Your email"
              error={errors.email}
              {...register("email")}
              type="email"
            />
            <PasswordInput
              register={register}
              error={errors.password}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white py-2 w-full rounded-md mt-4 font-medium"
            >
              Login to Admin Panel
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 hover:underline"
            >
              Return to Main Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
