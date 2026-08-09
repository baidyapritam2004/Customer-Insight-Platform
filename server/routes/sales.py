import os
import json
import uuid
import datetime

from flask import Blueprint, jsonify, request

sales = Blueprint("sales", __name__)

PRODUCT_FILE = "products.json"
ORDER_FILE = "orders.json"


# ===========================
# Sales Dashboard
# ===========================
@sales.route("/sales/dashboard/<vendor_id>", methods=["GET"])
def sales_dashboard(vendor_id):

    if not os.path.exists(ORDER_FILE):
        return jsonify({
            "revenue": 0,
            "gmv": 0,
            "profit": 0,
            "orders": 0,
            "completed_orders": 0,
            "pending_orders": 0,
            "average_order_value": 0
        })

    with open(ORDER_FILE, "r") as file:
        orders = json.load(file)
    orders = [
    order
    for order in orders
    if order["vendor_id"] == vendor_id
]
    revenue = sum(order.get("total", 0) for order in orders)

    total_orders = len(orders)

    completed_orders = sum(
        1 for order in orders
        if order["status"] == "Delivered"
    )

    pending_orders = sum(
        1 for order in orders
        if order["status"] == "Pending"
    )

    profit = revenue * 0.20

    average_order = revenue / total_orders if total_orders else 0

    return jsonify({
        "revenue": round(revenue, 2),
        "gmv": round(revenue, 2),
        "profit": round(profit, 2),
        "orders": total_orders,
        "completed_orders": completed_orders,
        "pending_orders": pending_orders,
        "average_order_value": round(average_order, 2)
    })


# ===========================
# Add Sale
# ===========================

@sales.route("/sales/add", methods=["POST"])
def add_sale():

    data = request.json

    if not os.path.exists(PRODUCT_FILE):
        return jsonify({"message": "Products not found"}), 404

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    selected_product = next(
        (
            product
            for product in products
            if product["product_id"] == data["product_id"]
        ),
        None
    )

    if not selected_product:
        return jsonify({"message": "Product not found"}), 404

    quantity = int(data["quantity"])

    price = selected_product["price"]

    total = quantity * price

    if os.path.exists(ORDER_FILE):

        with open(ORDER_FILE, "r") as file:
            orders = json.load(file)

    else:

        orders = []

    new_order = {

        "order_id": str(uuid.uuid4())[:8],

        "customer_name": data["customer_name"],

        "vendor_id": data["vendor_id"],

        "product_id": selected_product["product_id"],

        "product_name": selected_product["product_name"],

        "quantity": quantity,

        "price": price,

        "total": total,

        "payment_method": data["payment_method"],

        "status": data["status"],

        "date": datetime.datetime.now().strftime("%d-%m-%Y")
    }

    orders.append(new_order)

    with open(ORDER_FILE, "w") as file:
        json.dump(orders, file, indent=4)

    return jsonify({
        "message": "Sale created successfully",
        "order": new_order
    })


# ===========================
# Vendor Orders
# ===========================

@sales.route("/sales/vendor/<vendor_id>", methods=["GET"])
def vendor_sales(vendor_id):

    if not os.path.exists(ORDER_FILE):
        return jsonify([])

    with open(ORDER_FILE, "r") as file:
        orders = json.load(file)

    vendor_orders = [
        order
        for order in orders
        if order["vendor_id"] == vendor_id
    ]

    return jsonify(vendor_orders)


# ===========================
# Update Order
# ===========================

@sales.route("/sales/update/<order_id>", methods=["PUT"])
def update_order(order_id):

    data = request.json

    if not os.path.exists(ORDER_FILE):
        return jsonify({"message": "Orders not found"}), 404

    with open(ORDER_FILE, "r") as file:
        orders = json.load(file)

    updated = False

    for order in orders:

        if order["order_id"] == order_id:

            order["customer_name"] = data.get(
                "customer_name",
                order["customer_name"]
            )

            order["quantity"] = int(
                data.get(
                    "quantity",
                    order["quantity"]
                )
            )

            order["payment_method"] = data.get(
                "payment_method",
                order["payment_method"]
            )

            order["status"] = data.get(
                "status",
                order["status"]
            )

            order["total"] = order["price"] * order["quantity"]

            updated = True
            break

    if not updated:
        return jsonify({"message": "Order not found"}), 404

    with open(ORDER_FILE, "w") as file:
        json.dump(orders, file, indent=4)

    return jsonify({
        "message": "Order updated successfully"
    })


# ===========================
# Update Status
# ===========================

@sales.route("/sales/status/<order_id>", methods=["PUT"])
def update_order_status(order_id):

    data = request.json

    if not os.path.exists(ORDER_FILE):
        return jsonify({"message": "No orders"}), 404

    with open(ORDER_FILE, "r") as file:
        orders = json.load(file)

    for order in orders:

        if order["order_id"] == order_id:

            order["status"] = data["status"]

            with open(ORDER_FILE, "w") as file:
                json.dump(orders, file, indent=4)

            return jsonify(order)

    return jsonify({"message": "Order not found"}), 404


# ===========================
# Delete Order
# ===========================

@sales.route("/sales/delete/<order_id>", methods=["DELETE"])
def delete_order(order_id):

    if not os.path.exists(ORDER_FILE):
        return jsonify({"message": "No orders"}), 404

    with open(ORDER_FILE, "r") as file:
        orders = json.load(file)

    original = len(orders)

    orders = [
        order
        for order in orders
        if order["order_id"] != order_id
    ]

    if len(orders) == original:
        return jsonify({"message": "Order not found"}), 404

    with open(ORDER_FILE, "w") as file:
        json.dump(orders, file, indent=4)

    return jsonify({
        "message": "Order deleted successfully"
    })