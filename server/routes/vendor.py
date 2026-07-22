import json
import os
import uuid

from flask import Blueprint, request, jsonify

vendor = Blueprint("vendor", __name__)
print("Vendor routes loaded")
VENDOR_FILE = "vendors.json"

@vendor.route("/vendor/register", methods=["GET", "POST"])
def register_vendor():

    if request.method == "GET":
        return jsonify({"message": "Vendor route working"})

    # existing code...

    data = request.json

    if os.path.exists(VENDOR_FILE):

        with open(VENDOR_FILE, "r") as file:
            vendors = json.load(file)

    else:

        vendors = []

    new_vendor = {

        "vendor_id": str(uuid.uuid4())[:8],

        "business_name": data.get("business_name"),

        "owner_name": data.get("owner_name"),

        "email": data.get("email"),

        "phone": data.get("phone"),

        "gst_number": data.get("gst_number"),

        "address": data.get("address"),

        "commission": float(data.get("commission", 10)),

        "status": "Pending",

        "verified": False

    }

    vendors.append(new_vendor)

    with open(VENDOR_FILE, "w") as file:

        json.dump(vendors, file, indent=4)

    return jsonify({

        "message": "Vendor registered successfully.",

        "vendor": new_vendor

    })

@vendor.route("/vendor/all", methods=["GET"])
def get_all_vendors():
    if request.method == "GET":
        return jsonify({"message": "Vendor route working"})

    if not os.path.exists(VENDOR_FILE):
        return jsonify([])

    with open(VENDOR_FILE, "r") as file:
        vendors = json.load(file)

    return jsonify(vendors)

@vendor.route("/vendor/verify/<vendor_id>", methods=["GET", "PUT"])
def verify_vendor(vendor_id):

    if request.method == "GET":
        return jsonify({"message": "Verify Vendor API is working", "vendor_id": vendor_id})

    with open(VENDOR_FILE, "r") as file:
        vendors = json.load(file)

    for vendor in vendors:

        if vendor["vendor_id"] == vendor_id:

            vendor["verified"] = True
            vendor["status"] = "Active"

            break

    with open(VENDOR_FILE, "w") as file:
        json.dump(vendors, file, indent=4)

    return jsonify({

        "message": "Vendor verified successfully."

    })

@vendor.route("/vendor/suspend/<vendor_id>", methods=["GET", "PUT"])
def suspend_vendor(vendor_id):

    if request.method == "GET":
        return jsonify({"message": "Suspend Vendor API is working", "vendor_id": vendor_id})

    with open(VENDOR_FILE, "r") as file:
        vendors = json.load(file)

    for vendor in vendors:

        if vendor["vendor_id"] == vendor_id:

            vendor["status"] = "Suspended"

            break

    with open(VENDOR_FILE, "w") as file:
        json.dump(vendors, file, indent=4)

    return jsonify({

        "message": "Vendor suspended."

    })

@vendor.route("/vendor/update/<vendor_id>", methods=["GET", "PUT"])
def update_vendor(vendor_id):

    if request.method == "GET":
        return jsonify({"message": "Update Vendor API is working", "vendor_id": vendor_id})

    data = request.json

    with open(VENDOR_FILE, "r") as file:
        vendors = json.load(file)

    updated = False

    for vendor in vendors:

        if vendor["vendor_id"] == vendor_id:

            vendor["business_name"] = data.get("business_name", vendor["business_name"])
            vendor["owner_name"] = data.get("owner_name", vendor["owner_name"])
            vendor["email"] = data.get("email", vendor["email"])
            vendor["phone"] = data.get("phone", vendor["phone"])
            vendor["gst_number"] = data.get("gst_number", vendor["gst_number"])
            vendor["address"] = data.get("address", vendor["address"])
            vendor["commission"] = data.get("commission", vendor["commission"])

            updated = True
            break

    if not updated:
        return jsonify({"message": "Vendor not found"}), 404

    with open(VENDOR_FILE, "w") as file:
        json.dump(vendors, file, indent=4)

    return jsonify({"message": "Vendor updated successfully"})

@vendor.route("/vendor/delete/<vendor_id>", methods=["GET", "DELETE"])
def delete_vendor(vendor_id):

    if request.method == "GET":
        return jsonify({"message": "Delete Vendor API is working", "vendor_id": vendor_id})

    with open(VENDOR_FILE, "r") as file:
        vendors = json.load(file)

    vendors = [
        vendor for vendor in vendors
        if vendor["vendor_id"] != vendor_id
    ]

    with open(VENDOR_FILE, "w") as file:
        json.dump(vendors, file, indent=4)

    return jsonify({
        "message": "Vendor deleted successfully."
    })


@vendor.route("/vendor/performance", methods=["GET"])
def vendor_performance():
    if request.method =="GET":
        return jsonify({"message": "Working"})
    if not os.path.exists(VENDOR_FILE):
        return jsonify([])

    if not os.path.exists(PRODUCT_FILE):
        return jsonify([])

    with open(VENDOR_FILE, "r") as file:
        vendors = json.load(file)

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    performance = []

    for vendor in vendors:

        vendor_products = [

            p for p in products

            if p.get("vendor_id") == vendor["vendor_id"]

        ]

        revenue = sum(

            p["price"] * p["stock"]

            for p in vendor_products

        )

        orders = sum(

            p["stock"]

            for p in vendor_products

        )

        if vendor_products:

            average_rating = round(

                sum(

                    p.get("rating", 0)

                    for p in vendor_products

                ) / len(vendor_products),

                2

            )

        else:

            average_rating = 0

        performance.append({

            "vendor_id": vendor["vendor_id"],

            "business_name": vendor["business_name"],

            "revenue": round(revenue, 2),

            "orders": orders,

            "average_rating": average_rating,

            "fulfillment": 95,

            "growth": 12,

            "refund": 2

        })

    for vendor in performance:

        score = (

        vendor["revenue"] * 0.40 +

        vendor["orders"] * 0.25 +

        vendor["average_rating"] * 1000 * 0.20 +

        vendor["fulfillment"] * 100 +

        (100 - vendor["refund"]) * 50

    )
    performance.sort(

    key=lambda x: x["performance_score"],

    reverse=True

)

    vendor["performance_score"] = round(score,2)

    for index, vendor in enumerate(performance):

        vendor["rank"] = index + 1

    return jsonify(performance)