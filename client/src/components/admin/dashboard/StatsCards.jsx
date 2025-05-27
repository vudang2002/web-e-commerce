import {
  FiShoppingCart,
  FiTruck,
  FiCheckCircle,
  FiRotateCw,
} from "react-icons/fi";

const cards = [
  { icon: <FiShoppingCart />, label: "Total Orders" },
  { icon: <FiTruck />, label: "Active Orders" },
  { icon: <FiCheckCircle />, label: "Completed Orders" },
  { icon: <FiRotateCw />, label: "Return Orders" },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map((item, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <p className="text-gray-500 text-sm">{item.label}</p>
            <h2 className="text-xl font-semibold">₹126.500</h2>
            <p className="text-sm text-green-600">
              ▲ 34.7%{" "}
              <span className="text-gray-400">Compared to Oct 2023</span>
            </p>
          </div>
          <div className="text-2xl text-blue-600">{item.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
