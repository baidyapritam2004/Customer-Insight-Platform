import json
import os

from flask import Blueprint, jsonify

vendor_dashboard = Blueprint("vendor_dashboard", __name__)

PRODUCT_FILE = "products.json"


@vendor_dashboard.route("/vendor/dashboard/<vendor_id>")
def dashboard(vendor_id):

    if not os.path.exists(PRODUCT_FILE):
        return jsonify({})

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    my_products = [
        p for p in products
        if p["vendor_id"] == vendor_id
    ]

    revenue = sum(
        p["price"] * p["stock"]
        for p in my_products
    )

    low_stock = len([
        p for p in my_products
        if p["stock"] < 10
    ])

    return jsonify({

        "revenue": revenue,

        "products": len(my_products),

        "orders": 125,

        "low_stock": low_stock

    })