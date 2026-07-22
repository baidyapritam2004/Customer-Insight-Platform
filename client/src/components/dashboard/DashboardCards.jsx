import DashboardCard from "./DashboardCard";

function DashboardCards() {

    return (

        <div className="cards">

            <DashboardCard
                title="Customers"
                value="1250"
            />

            <DashboardCard
                title="Revenue"
                value="₹8,20,000"
            />

            <DashboardCard
                title="Orders"
                value="720"
            />

            <DashboardCard
                title="Average Rating"
                value="4.7 ⭐"
            />

        </div>

    );

}

export default DashboardCards;