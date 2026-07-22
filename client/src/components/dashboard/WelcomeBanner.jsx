import "../../styles/welcomebanner.css";

function WelcomeBanner() {

    const today = new Date();

    const date = today.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return (

        <div className="welcome-banner">

            <div className="banner-left">

                <h1>
                    Welcome Back, Pritam 👋
                </h1>

                <p>
                    Here's what's happening with your business today.
                </p>

                <span className="banner-date">
                    {date}
                </span>

            </div>

            <div className="banner-right">

                <div className="growth-card">

                    <h2>+18%</h2>

                    <p>Revenue Growth</p>

                </div>

            </div>

        </div>

    );

}

export default WelcomeBanner;