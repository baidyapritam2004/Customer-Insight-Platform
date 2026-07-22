from flask import Blueprint, jsonify
import json
import os

dashboard = Blueprint("dashboard", __name__)

PRODUCT_FILE = "products.json"
VENDOR_FILE = "vendors.json"

@dashboard.route("/dashboard/executive")
def executive_dashboard():

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    with open(VENDOR_FILE, "r") as file:
        vendors = json.load(file)

    total_products = len(products)

    total_vendors = len(vendors)

    total_stock = sum(
        p["stock"]
        for p in products
    )

    revenue = sum(
        p["price"] * p["stock"]
        for p in products
    )

    return jsonify({

        "products": total_products,

        "vendors": total_vendors,

        "inventory": total_stock,

        "revenue": revenue

    })