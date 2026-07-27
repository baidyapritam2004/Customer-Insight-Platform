import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = () => {
    axios
      .get("http://localhost:5000/order/all")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/order/status/${orderId}`, {
        status,
      });

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await axios.delete(`http://localhost:5000/order/delete/${orderId}`);

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };
console.log("Orders:", orders);
  return (
    <div>
      <h2>Order Management</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Vendor</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(orders) &&
  orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.customer_name}</td>
              <td>{order.product_name}</td>
              <td>{order.vendor_id}</td>
              <td>{order.quantity}</td>
              <td>₹{order.total}</td>
              <td>{order.payment_method}</td>
              <td>{order.date}</td>

              <td>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.order_id, e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Packed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>

              <td>
                <button onClick={() => deleteOrder(order.order_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;