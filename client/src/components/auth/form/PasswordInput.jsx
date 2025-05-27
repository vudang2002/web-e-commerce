import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
const PasswordInput = ({ register, show, toggle, error }) => {
  return (
    <div>
      <label className="text-sm">Your password</label>
      <div className="relative">
        <input
          {...register("password")}
          type={show ? "text" : "password"}
          className="w-full border rounded p-2 pr-10"
        />
        <span
          onClick={toggle}
          className="absolute top-2 right-3 text-sm text-gray-500 cursor-pointer"
        >
          {show ? (
            <AiOutlineEyeInvisible size={24} />
          ) : (
            <AiOutlineEye size={24} />
          )}
        </span>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};
export default PasswordInput;
