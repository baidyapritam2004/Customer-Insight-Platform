import { useEffect, useState } from "react";
import axios from "axios";

function Vendors() {

    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/vendor/all")
            .then((res) => setVendors(res.data));
    }, []);

    return (
        <div>
            <h2>Vendor Management</h2>

            <table>
                <thead>
                    <tr>
                        <th>Business</th>
                        <th>Owner</th>
                        <th>Status</th>
                        <th>Commission</th>
                    </tr>
                </thead>

                <tbody>
                    {Array.isArray(vendors) &&
    vendors.map((vendor) => (
        <tr key={vendor.vendor_id}>
            <td>{vendor.business_name}</td>
            <td>{vendor.owner_name}</td>
            <td>{vendor.status}</td>
            <td>{vendor.commission}%</td>
        </tr>
    ))
}
                </tbody>
            </table>
        </div>
    );
}

export default Vendors;