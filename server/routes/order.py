import json
import os
import uuid
from datetime import datetime

from flask import Blueprint, request, jsonify

order = Blueprint("order", __name__)

ORDER_FILE = "orders.json"
PRODUCT_FILE = "products.json"


def load_json(file_name):
    if not os.path.exists(file_name):
        return []

    try:
        with open(file_name, "r") as file:
            return json.load(file)
    except:
        return []


def save_json(file_name, data):
    with open(file_name, "w") as file:
        json.dump(data, file, indent=4)


@order.route("/order/create", methods=["GET", "POST"])
def create_order():
    if request.method=="GET":
        return jsonify({"message": "API is working"})

    data = request.json

    orders = load_json(ORDER_FILE)
    products = load_json(PRODUCT_FILE)

    product = None

    for p in products:
        if p["product_id"] == data["product_id"]:
            product = p
            break

    if product is None:
        return jsonify({"message": "Product not found"}), 404

    quantity = int(data["quantity"])

    if product["stock"] < quantity:
        return jsonify({"message": "Insufficient stock"}), 400

    total = quantity * product["price"]

    order_data = {

        "order_id": str(uuid.uuid4())[:8],

        "customer_name": data["customer_name"],

        "vendor_id": product["vendor_id"],

        "product_id": product["product_id"],

        "product_name": product["product_name"],

        "quantity": quantity,

        "price": product["price"],

        "total": total,

        "payment_method": data["payment_method"],

        "status": "Pending",

        "date": datetime.now().strftime("%d-%m-%Y")

    }

    orders.append(order_data)

    product["stock"] -= quantity

    save_json(ORDER_FILE, orders)
    save_json(PRODUCT_FILE, products)

    return jsonify({

        "message": "Order created successfully.",

        "order": order_data

    })

@order.route("/order/all", methods=["GET"])
def get_all_orders():

    orders = load_json(ORDER_FILE)

    return jsonify(orders)

@order.route("/order/vendor/<vendor_id>", methods=["GET"])
def vendor_orders(vendor_id):

    orders = load_json(ORDER_FILE)

    vendor_orders = [

        order for order in orders

        if order["vendor_id"] == vendor_id

    ]

    return jsonify(vendor_orders)

@order.route("/order/status/<order_id>", methods=["GET", "PUT"])
def update_status(order_id):

    data = request.json

    orders = load_json(ORDER_FILE)

    for order in orders:

        if order["order_id"] == order_id:

            order["status"] = data["status"]

            save_json(ORDER_FILE, orders)

            return jsonify({

                "message": "Status Updated"

            })

    return jsonify({

        "message": "Order not found"

    }),404

@order.route("/order/delete/<order_id>", methods=["DELETE"])
def delete_order(order_id):

    orders = load_json(ORDER_FILE)

    orders = [

        order

        for order in orders

        if order["order_id"] != order_id

    ]

    save_json(ORDER_FILE, orders)

    return jsonify({

        "message":"Order Deleted"

    })