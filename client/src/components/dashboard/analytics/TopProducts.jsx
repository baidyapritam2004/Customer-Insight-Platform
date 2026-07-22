import "../../../styles/analytics.css";

function TopProducts({ data }) {

    if (!data || data.length === 0) {
        return (
            <div className="analytics-card">
                <h2>Top 10 Products</h2>
                <p>No data available.</p>
            </div>
        );
    }

    return (

        <div className="analytics-card">

            <h2>Top 10 Products</h2>

            <table className="analytics-table">

                <thead>

                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Rating</th>
                    </tr>

                </thead>

                <tbody>

                    {data.map((product, index) => (

                        <tr key={index}>

                            <td>{product.Product}</td>

                            <td>{product.Category}</td>

                            <td>₹{product.Price}</td>

                            <td>⭐ {product.Rating}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default TopProducts;