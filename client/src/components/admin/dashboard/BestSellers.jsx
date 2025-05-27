const bestSellers = [
  {
    id: 1,
    name: "Lorem Ipsum",
    price: "₹126.50",
    sales: "999",
    image: "/images/placeholder.png",
  },
  {
    id: 2,
    name: "Lorem Ipsum",
    price: "₹126.50",
    sales: "999",
    image: "/images/placeholder.png",
  },
  {
    id: 3,
    name: "Lorem Ipsum",
    price: "₹126.50",
    sales: "999",
    image: "/images/placeholder.png",
  },
];

const BestSellers = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Best Sellers</h3>
        <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded">
          REPORT
        </button>
      </div>
      <ul className="space-y-4">
        {bestSellers.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-10 h-10 rounded bg-gray-100"
            />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.sales} sales</p>
            </div>
            <div className="font-semibold">{item.price}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BestSellers;
