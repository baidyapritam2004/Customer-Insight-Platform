import "../../styles/kpicard.css";

function KPICard({
    icon,
    title,
    value,
    subtitle,
    trend,
    trendType = "up"
}) {

    return (

        <div className="kpi-card">

            <div className="kpi-icon">

                {icon}

            </div>

            <div className="kpi-content">

                <div className="kpi-top">

                    <h4>{title}</h4>

                    <span className={`trend ${trendType}`}>
                        {trend}
                    </span>

                </div>

                <h2>{value}</h2>

                <p>{subtitle}</p>

            </div>

        </div>

    );

}

export default KPICard;