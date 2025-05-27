import { FiSearch } from "react-icons/fi";

const SearchBox = () => {
  return (
    <form className="relative flex w-full max-w-4xl">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <FiSearch size={20} />
      </span>
      <input
        type="text"
        placeholder="Freeship đơn từ 45k"
        className="flex-grow pl-10 pr-4 py-2 rounded-l-lg border 
        border-gray-300 focus:outline-none placeholder-gray-400 text-sm bg-white"
      />
      <button
        type="submit"
        className="bg-white border border-l-0 border-gray-300 text-primary px-5 rounded-r-lg text-sm font-medium hover:bg-gray-100"
      >
        Tìm kiếm
      </button>
    </form>
  );
};

export default SearchBox;
