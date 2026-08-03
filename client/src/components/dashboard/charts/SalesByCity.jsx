import {
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";
const colors = [
    "#3b82f6", // Blue
    "#10b981", // Green
    "#f59e0b", // Orange
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
];

function SalesByCity({ data }) {

    return (

        <div className="chart-card">

            <ResponsiveContainer
                width="100%"
                height={320}
            >

                <BarChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="city" />

                    <YAxis />

                    <Tooltip />

                    <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
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

export default SalesByCity;