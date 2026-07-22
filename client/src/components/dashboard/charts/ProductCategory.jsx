import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function ProductCategory({ data, onSelectCategory  }) {
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
    onClick={(data) =>
        onSelectCategory(data.category)
    }
/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProductCategory;
