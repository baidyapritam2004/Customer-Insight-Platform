import "../../styles/chartcard.css";

function ChartCard({ title, children }) {
    return (
        <div className="chart-card">

            <div className="chart-header">

                <h3>{title}</h3>

            </div>

            <div className="chart-body">

                {children}

            </div>

        </div>
    );
}

export default ChartCard;