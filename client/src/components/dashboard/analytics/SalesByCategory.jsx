import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

function SalesByCategory({ data }) {

    if (!data || data.length === 0) {
        return (
            <div className="analytics-card">
                <h2>Sales by Category</h2>
                <p>No data available.</p>
            </div>
        );
    }

    return (

        <div className="analytics-card">

            <h2>Sales by Category</h2>

            <ResponsiveContainer width="100%" height={400}>

                <BarChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="category" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="sales"
                        fill="#2563EB"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default SalesByCategory;