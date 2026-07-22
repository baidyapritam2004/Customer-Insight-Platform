import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

function RevenueChart({ data }) {

    if (!data || data.length === 0) {

        return (
            <div className="chart-card">
                <p>No revenue data available.</p>
            </div>
        );

    }

    return (

        <div className="chart-card">
            <ResponsiveContainer width="100%" height={300}>

                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3"/>

                    <XAxis dataKey="month"/>

                    <YAxis/>

                    <Tooltip/>

                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563EB"
                        strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}

export default RevenueChart;