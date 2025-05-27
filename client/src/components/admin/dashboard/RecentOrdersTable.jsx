const orders = [
  {
    id: "#25426",
    date: "Nov 8th,2023",
    customer: "Kavin",
    avatar: "/avatars/1.jpg",
    status: "Delivered",
    amount: "₹200.00",
  },
  {
    id: "#25425",
    date: "Nov 7th,2023",
    customer: "Komael",
    avatar: "/avatars/2.jpg",
    status: "Canceled",
    amount: "₹200.00",
  },
  {
    id: "#25424",
    date: "Nov 6th,2023",
    customer: "Nikhil",
    avatar: "/avatars/3.jpg",
    status: "Delivered",
    amount: "₹200.00",
  },
  {
    id: "#25423",
    date: "Nov 5th,2023",
    customer: "Shivam",
    avatar: "/avatars/4.jpg",
    status: "Canceled",
    amount: "₹200.00",
  },
  {
    id: "#25422",
    date: "Nov 4th,2023",
    customer: "Shadab",
    avatar: "/avatars/5.jpg",
    status: "Delivered",
    amount: "₹200.00",
  },
  {
    id: "#25421",
    date: "Nov 2nd,2023",
    customer: "Yogesh",
    avatar: "/avatars/6.jpg",
    status: "Delivered",
    amount: "₹200.00",
  },
];

const statusColor = {
  Delivered: "text-blue-600",
  Canceled: "text-orange-500",
};

const RecentOrdersTable = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-medium mb-4">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="p-2">
                <input type="checkbox" />
              </th>
              <th className="p-2">Product</th>
              <th className="p-2">Order ID</th>
              <th className="p-2">Date</th>
              <th className="p-2">Customer Name</th>
              <th className="p-2">Status</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <input type="checkbox" />
                </td>
                <td className="p-2">Lorem Ipsum</td>
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.date}</td>
                <td className="p-2 flex items-center gap-2">
                  <img
                    src={order.avatar}
                    alt={order.customer}
                    className="w-6 h-6 rounded-full"
                  />
                  {order.customer}
                </td>
                <td className={`p-2 font-medium ${statusColor[order.status]}`}>
                  ● {order.status}
                </td>
                <td className="p-2 font-semibold">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
