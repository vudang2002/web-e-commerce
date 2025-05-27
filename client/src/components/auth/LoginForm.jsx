import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SocialButtons from "./SocialButtons";
import FormDivider from "./form/FormDivider";
import TextInput from "./form/TextInput";
import PasswordInput from "./form/PasswordInput";
import { useState } from "react";
import { login } from "../../services/authService";
import { useTranslation } from "react-i18next";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginForm({ switchForm, onLoginSuccess }) {
  const { t } = useTranslation();
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

      // Notify parent component about login success
      onLoginSuccess(user);

      // Clear error message on success
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-1">{t("login")}</h2>
      <p className="text-sm text-gray-500 mb-4">
        {t("don't_have_an_account?")}{" "}
        <button className="text-black underline" onClick={switchForm}>
          {t("sign_up")}
        </button>
      </p>
      {errorMessage && (
        <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
      )}
      <SocialButtons />
      <FormDivider />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
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
        <div className="text-right text-sm">
          <button className="underline">Forget your password</button>
        </div>
        <button
          type="submit"
          className="bg-primary text-white py-2 w-full rounded-full mt-2"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
