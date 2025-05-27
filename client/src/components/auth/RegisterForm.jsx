import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SocialButtons from "./SocialButtons";
import FormDivider from "./form/FormDivider";
import TextInput from "./form/TextInput";
import PasswordInput from "./form/PasswordInput";
import { useState } from "react";
import { register as registerUser } from "../../services/authService";

const registerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function RegisterForm({ switchForm }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerSchema) });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      // Extract only the required fields for the API
      const { name, email, password } = data;
      await registerUser({ name, email, password });

      // Clear error message and set success message
      setErrorMessage("");
      setSuccessMessage("Đăng ký thành công! Vui lòng đăng nhập.");
    } catch (error) {
      setSuccessMessage(""); // Clear success message on error
      if (error.response?.data?.message?.includes("E11000")) {
        setErrorMessage("Email đã được sử dụng. Vui lòng thử email khác.");
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      {successMessage && (
        <p className="text-green-500 text-sm mb-2 ">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
      )}
      <h2 className="text-2xl font-bold mb-1">Sign up</h2>
      <p className="text-sm text-gray-500 mb-4">
        Already have an account?{" "}
        <button className="text-black underline" onClick={switchForm}>
          Log in
        </button>
      </p>
      <SocialButtons />
      <FormDivider />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
        <TextInput
          label="Your name"
          error={errors.name}
          {...register("name")}
        />
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
        <div>
          <label className="text-sm">Confirm password</label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              className="w-full border rounded p-2 pr-10"
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute top-2 right-3 text-sm text-gray-500 cursor-pointer"
            >
              {showConfirm ? "Hide" : "Show"}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-gray-400 text-white py-2 w-full rounded-full mt-2"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
