import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
const colors = [
  "#f59e0b", // Orange
  "#ef4444", // Red
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#10b981", // Green

  "#8b5cf6", // Purple
];

function ProductCategory({ data, onSelectCategory }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h2>Category Sales</h2>
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="category" angle={-25} textAnchor="end" height={70} />
          <YAxis />

          <Tooltip />

          <Bar
    dataKey="sales"
    radius={[8, 8, 0, 0]}
    onClick={(data) => onSelectCategory(data.category)}
>
    {data.map((entry, index) => (
        <Cell
            key={`cell-${index}`}
            fill={colors[index % colors.length]}
        />
    ))}
</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProductCategory;
