function DataCleaningSummary({ summary }) {

    if (!summary) return null;

    return (

        <div className="card">

            <h2>Data Cleaning Report</h2>

            <p>Rows Loaded: {summary.rows_before}</p>

            <p>Valid Rows: {summary.rows_after}</p>

            <p>Duplicates Removed: {summary.duplicates_removed}</p>

            <p>Empty Rows Removed: {summary.empty_rows_removed}</p>

            <p>Prices Fixed: {summary.missing_prices_fixed}</p>

            <p>Ratings Fixed: {summary.missing_ratings_fixed}</p>

            <p>Invalid Rows Removed: {summary.invalid_rows_removed}</p>

        </div>

    );

}

export default DataCleaningSummary;