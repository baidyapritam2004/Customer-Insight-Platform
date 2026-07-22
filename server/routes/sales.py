import os
import json

from flask import Blueprint, jsonify

sales = Blueprint("sales", __name__)

PRODUCT_FILE = "products.json"

@sales.route("/sales/dashboard", methods=["GET"])
def sales_dashboard():

    if not os.path.exists(PRODUCT_FILE):
        return jsonify({})

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    revenue = 0
    orders = 0
    profit = 0

    for product in products:

        qty = product.get("stock", 0)

        price = product.get("price", 0)

        revenue += qty * price

        orders += qty

        profit += qty * price * 0.20

    gmv = revenue

    average_order = revenue / orders if orders else 0

    return jsonify({

        "revenue": round(revenue,2),

        "gmv": round(gmv,2),

        "profit": round(profit,2),

        "orders": orders,

        "average_order_value": round(average_order,2)

    })