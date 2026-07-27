import { useEffect, useState } from "react";
import axios from "axios";

function Products() {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        axios
            .get("http://localhost:5000/product/all")
            .then((res) => {

                if (Array.isArray(res.data)) {
                    setProducts(res.data);
                } else {
                    setProducts([]);
                }

            })
            .catch((err) => console.log(err));

    }, []);

    return (

        <div className="page">

            <h1>Product Management</h1>

            <table>

                <thead>

                    <tr>

                        <th>Product</th>
                        <th>Category</th>
                        <th>Vendor</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Warehouse</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        products.map((product) => (

                            <tr key={product.product_id}>

                                <td>{product.product_name}</td>

                                <td>{product.category}</td>

                                <td>{product.vendor_id}</td>

                                <td>₹{product.price}</td>

                                <td>{product.stock}</td>

                                <td>{product.warehouse}</td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default Products;