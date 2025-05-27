import { FaFacebook, FaGoogle } from "react-icons/fa";

export default function SocialButtons() {
  return (
    <>
      <button className="flex items-center justify-center w-full border rounded-full py-2 mb-3">
        <FaFacebook className="text-blue-600 mr-2" /> Log in with Facebook
      </button>
      <button className="flex items-center justify-center w-full border rounded-full py-2 mb-3">
        <FaGoogle className="text-red-500 mr-2" /> Log in with Google
      </button>
    </>
  );
}
