import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "JUL", value: 100 },
  { month: "AUG", value: 110 },
  { month: "SEP", value: 90 },
  { month: "OCT", value: 120 },
  { month: "NOV", value: 250 },
  { month: "DEC", value: 400 },
];

const SalesChart = () => {
  return (
    <div className="bg-white p-4 rounded shadow col-span-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Sale Graph</h3>
        <div className="space-x-2">
          <button className="text-sm px-2 py-1 border rounded">WEEKLY</button>
          <button className="text-sm px-2 py-1 border rounded bg-blue-600 text-white">
            MONTHLY
          </button>
          <button className="text-sm px-2 py-1 border rounded">YEARLY</button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
