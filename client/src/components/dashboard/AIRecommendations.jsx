import {
    FaLightbulb,
    FaBullhorn,
    FaChartLine,
    FaStar,
    FaCheckCircle
} from "react-icons/fa";

import "../../styles/recommendations.css";

function AIRecommendations({ data }) {

    if (!data || data.length === 0) return null;

    const getIcon = (title) => {

        const text = title.toLowerCase();

        if (text.includes("rating"))
            return <FaStar />;

        if (text.includes("marketing"))
            return <FaBullhorn />;

        if (text.includes("pricing"))
            return <FaChartLine />;

        if (text.includes("category"))
            return <FaCheckCircle />;

        return <FaLightbulb />;
    };

    const getPriority = (title) => {

        const text = title.toLowerCase();

        if (text.includes("marketing"))
            return "High";

        if (text.includes("rating"))
            return "Medium";

        return "Low";
    };

    return (

        <div className="recommendation-card">

            <h2>AI Recommendations</h2>

            <div className="recommendation-list">

                {data.map((item, index) => (

                    <div
                        className="recommendation-item"
                        key={index}
                    >

                        <div className="recommendation-top">

                            <div className="recommendation-icon">

                                {getIcon(item.title)}

                            </div>

                            <span
                                className={`priority ${getPriority(item.title).toLowerCase()}`}
                            >

                                {getPriority(item.title)}

                            </span>

                        </div>

                        <h3>{item.title}</h3>

                        <p>{item.text}</p>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default AIRecommendations;