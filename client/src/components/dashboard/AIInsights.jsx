import "../../styles/aiInsights.css";
import { FaLightbulb } from "react-icons/fa";

function AIInsights({ data }) {

    if (!data || data.length === 0) {
        return (
            <div className="insights-card">
                <h2>AI Insights</h2>
                <p>No insights available.</p>
            </div>
        );
    }

    return (

        <div className="insights-card">

            <h2>AI Insights</h2>

            <div className="insight-list">

                {data.map((item, index) => (

                    <div className="insight-item" key={index}>

                        <div className="insight-icon">
                            <FaLightbulb />
                        </div>

                        <div className="insight-content">

                            <h4>{item.title}</h4>

                            <p>{item.text}</p>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default AIInsights;