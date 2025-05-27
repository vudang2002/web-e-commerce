import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Modal from "../common/Modal";

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLogin(true); // Reset to login form when modal is opened
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isLogin ? (
        <LoginForm
          switchForm={() => setIsLogin(false)}
          onLoginSuccess={onLoginSuccess}
        />
      ) : (
        <RegisterForm switchForm={() => setIsLogin(true)} />
      )}
    </Modal>
  );
}
