import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

function CustomerGrowth({ data }) {

    if (!data || data.length === 0) {

        return (
            <div className="chart-card">
                <h2>Customer Growth</h2>
                <p>No data available.</p>
            </div>
        );

    }

    return (

        <div className="chart-card">

          

            <ResponsiveContainer width="100%" height={300}>

                <AreaChart data={data}>

                    <CartesianGrid strokeDasharray="3 3"/>

                    <XAxis dataKey="month"/>

                    <YAxis/>

                    <Tooltip/>

                    <Area
                        type="monotone"
                        dataKey="customers"
                        stroke="#10B981"
                        fill="#10B98155"
                    />

                </AreaChart>

            </ResponsiveContainer>

        </div>

    );

}

export default CustomerGrowth;