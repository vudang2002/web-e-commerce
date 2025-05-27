export default function FormDivider() {
  return (
    <div className="flex items-center w-full my-3">
      <hr className="flex-grow border-gray-300" />
      <span className="mx-2 text-sm text-gray-500">OR</span>
      <hr className="flex-grow border-gray-300" />
    </div>
  );
}
