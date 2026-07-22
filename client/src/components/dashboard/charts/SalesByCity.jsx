import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

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

                    <Bar dataKey="sales" />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default SalesByCity;