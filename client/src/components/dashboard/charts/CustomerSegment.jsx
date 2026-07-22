import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

const COLORS = [
    "#2563EB",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4"
];

function CustomerSegment({ data }) {

    if (!data || data.length === 0) {

        return (
            <div className="chart-card">
                <h2>Customer Segmentation</h2>
                <p>No data available.</p>
            </div>
        );

    }

    return (

        <div className="chart-card">



            <ResponsiveContainer width="100%" height={300}>

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                    >

                        {data.map((entry,index)=>(

                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />

                        ))}

                    </Pie>

                    <Tooltip/>

                    <Legend/>

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

}

export default CustomerSegment;