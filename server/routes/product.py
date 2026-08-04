import datetime
import json
import os
import uuid

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

product = Blueprint("product", __name__)

PRODUCT_FILE = "products.json"
INVENTORY_FILE = "inventory.json"
IMAGE_FOLDER = "static/product_images"

os.makedirs(IMAGE_FOLDER, exist_ok=True)

@product.route("/product/add", methods=["GET", "POST"])
def add_product():

    if request.method == "GET":
        return jsonify({"message": "Product route working"})



    if os.path.exists(PRODUCT_FILE):

        with open(PRODUCT_FILE, "r") as file:
            products = json.load(file)

    else:

        products = []

    new_product = {
    "product_id": str(uuid.uuid4())[:8],

    "product_name": data.get("product_name"),
    "category": data.get("category"),
    "brand": data.get("brand"),
    "description": data.get("description"),

    "price": float(data.get("price")),
    "stock": int(data.get("stock")),

    "warehouse": data.get("warehouse"),

    "vendor_id": data.get("vendor_id"),

    "image": data.get("image", ""),

    "rating": 0,

    "created_at": datetime.datetime.now().strftime("%d-%m-%Y")
}

    products.append(new_product)

    with open(PRODUCT_FILE, "w") as file:

        json.dump(products, file, indent=4)

    return jsonify({

        "message": "Product added successfully.",

        "product": new_product

    })

@product.route("/product/all", methods=["GET", "POST"])
def get_all_products():

    if request.method == "GET":
        return jsonify({"message": "Product route working"})

    if not os.path.exists(PRODUCT_FILE):
        return jsonify([])

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    return jsonify(products)

@product.route("/product/update/<product_id>", methods=["GET", "PUT"])
def update_product(product_id):

    if request.method == "GET":
        return jsonify({
            "message": "Update Product API is working",
            "product_id": product_id
        })

     

    if not os.path.exists(PRODUCT_FILE):
        return jsonify({"message": "No products found"}), 404

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    updated = False

    for product in products:

        if product["product_id"] == product_id:

            product["product_name"] = data.get(
                "product_name",
                product["product_name"]
            )

            product["category"] = data.get(
                "category",
                product["category"]
            )

            product["brand"] = data.get(
                "brand",
                product.get("brand")
            )

            product["description"] = data.get(
                "description",
                product.get("description")
            )

            product["image"] = data.get(
                "image",
                product.get("image")
            )

            product["price"] = float(
                data.get("price", product["price"])
            )

            product["stock"] = int(
                data.get("stock", product["stock"])
            )

            product["warehouse"] = data.get(
                "warehouse",
                product.get("warehouse")
            )

            updated = True
            break

    if not updated:
        return jsonify({"message": "Product not found"}), 404

    with open(PRODUCT_FILE, "w") as file:
        json.dump(products, file, indent=4)

    return jsonify({
        "message": "Product updated successfully"
    })

@product.route("/product/delete/<product_id>", methods=["GET", "DELETE"])
def delete_product(product_id):

    if request.method == "GET":
        return jsonify({
            "message": "Delete Product API is working",
            "product_id": product_id
        })

     

    # existing delete code...

    if not os.path.exists(PRODUCT_FILE):
        return jsonify({"message": "No products found"}), 404

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    original = len(products)

    products = [
        p for p in products
        if p["product_id"] != product_id
    ]

    if len(products) == original:
        return jsonify({
            "message": "Product not found"
        }),404

    with open(PRODUCT_FILE, "w") as file:
        json.dump(products, file, indent=4)

    return jsonify({
        "message": "Product deleted successfully"
    })

@product.route("/product/upload-image/<product_id>", methods=["GET", "POST"])
def upload_product_image(product_id):

    if request.method == "GET":
        return jsonify({"message": "Upload Product Image API is working", "product_id": product_id})

    if "image" not in request.files:
        return jsonify({"message": "No image uploaded"}), 400

    image = request.files["image"]

    filename = secure_filename(image.filename)

    image.save(os.path.join(IMAGE_FOLDER, filename))

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    for product in products:

        if product["product_id"] == product_id:

            product["image"] = filename

            break

    with open(PRODUCT_FILE, "w") as file:
        json.dump(products, file, indent=4)

    return jsonify({
        "message": "Image uploaded successfully.",
        "filename": filename
    })

@product.route("/product/update-price/<product_id>", methods=["GET", "PUT"])
def update_price(product_id):
    if request.method == "GET":
        return jsonify({"message": "Update Price API is working", "product_id": product_id})

     

    if not os.path.exists(PRODUCT_FILE):
        return jsonify({"message": "No products found"}), 404

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    for product in products:

        if product["product_id"] == product_id:

            product["price"] = float(data["price"])

            with open(PRODUCT_FILE, "w") as file:
                json.dump(products, file, indent=4)

            return jsonify({
                "message": "Price updated successfully.",
                "product": product
            })

    return jsonify({"message": "Product not found"}), 404

@product.route("/product/update-stock/<product_id>", methods=["GET", "PUT"])
def update_stock(product_id):

    if request.method == "GET":
        return jsonify({"message": "Update Stock API is working", "product_id": product_id})

     

    if not os.path.exists(PRODUCT_FILE):
        return jsonify({"message": "No products found"}), 404

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    for product in products:

        if product["product_id"] == product_id:

            product["stock"] = int(data["stock"])

            with open(PRODUCT_FILE, "w") as file:
                json.dump(products, file, indent=4)

            return jsonify({
                "message": "Stock updated successfully.",
                "product": product
            })

    return jsonify({"message": "Product not found"}), 404

@product.route("/inventory/dashboard", methods=["GET"])
def inventory_dashboard():

    if not os.path.exists(PRODUCT_FILE):
        return jsonify({
            "total_products": 0,
            "total_stock": 0,
            "low_stock": 0,
            "out_of_stock": 0,
            "inventory_value": 0
        })

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    total_products = len(products)

    total_stock = sum(
        product.get("stock", 0)
        for product in products
    )

    low_stock = sum(
        1
        for product in products
        if 0 < product.get("stock", 0) <= 20
    )

    out_of_stock = sum(
        1
        for product in products
        if product.get("stock", 0) == 0
    )

    inventory_value = sum(
        product.get("price", 0) * product.get("stock", 0)
        for product in products
    )

    healthy_stock = sum(
        1
        for product in products
        if product.get("stock", 0) > 20
    )

    return jsonify({
        "total_products": total_products,
        "total_stock": total_stock,
        "healthy_stock": healthy_stock,
        "low_stock": low_stock,
        "out_of_stock": out_of_stock,
        "inventory_value": round(inventory_value, 2)
    })

@product.route("/inventory/alerts", methods=["GET"])
def inventory_alerts():

    if not os.path.exists(PRODUCT_FILE):
        return jsonify([])

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    alerts = []

    for product in products:

        stock = product.get("stock", 0)

        if stock == 0:

            alerts.append({

                "product_name": product["product_name"],

                "category": product["category"],

                "stock": stock,

                "status": "Out of Stock"

            })

        elif stock < 20:

            alerts.append({

                "product_name": product["product_name"],

                "category": product["category"],

                "stock": stock,

                "status": "Low Stock"

            })

    return jsonify(alerts)

@product.route("/inventory/stock-in/<product_id>", methods=["GET", "PUT"])
def stock_in(product_id):
    if request.method == "GET":
        return jsonify({"message": "Stock In API is working", "product_id": product_id})
     

    quantity = int(data["quantity"])

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    for product in products:

        if product["product_id"] == product_id:

            product["stock"] += quantity

            break

    with open(PRODUCT_FILE, "w") as file:
        json.dump(products, file, indent=4)

    if os.path.exists(INVENTORY_FILE):

        with open(INVENTORY_FILE, "r") as file:
            history = json.load(file)

    else:

        history = []

    history.append({

        "product_id": product_id,

        "type": "Stock In",

        "quantity": quantity,

        "date": datetime.datetime.now().strftime("%d-%m-%Y %H:%M")

    })

    with open(INVENTORY_FILE, "w") as file:
        json.dump(history, file, indent=4)

    return jsonify({

        "message": "Stock added successfully."

    })

@product.route("/inventory/stock-out/<product_id>", methods=["GET", "PUT"])
def stock_out(product_id):

    if request.method == "GET":
        return jsonify({"message": "Stock Out API is working", "product_id": product_id})

     

    quantity = int(data["quantity"])

    with open(PRODUCT_FILE, "r") as file:
        products = json.load(file)

    for product in products:

        if product["product_id"] == product_id:

            if product["stock"] < quantity:

                return jsonify({
                    "message": "Insufficient stock."
                }), 400

            product["stock"] -= quantity

            break

    with open(PRODUCT_FILE, "w") as file:
        json.dump(products, file, indent=4)

    if os.path.exists(INVENTORY_FILE):

        with open(INVENTORY_FILE, "r") as file:
            history = json.load(file)

    else:

        history = []

    history.append({

        "product_id": product_id,

        "type": "Stock Out",

        "quantity": quantity,

        "date": datetime.datetime.now().strftime("%d-%m-%Y %H:%M")
    })

    with open(INVENTORY_FILE, "w") as file:
        json.dump(history, file, indent=4)

    return jsonify({

        "message": "Stock deducted successfully."

    })

@product.route("/inventory/turnover", methods=["GET"])
def inventory_turnover():
    if request.method == "GET":
        return jsonify({"message": "Inventory Turnover API is working"})
    if not os.path.exists(PRODUCT_FILE):
        return jsonify([])

    if not os.path.exists(PRODUCT_FILE) or os.path.getsize(PRODUCT_FILE) == 0:
     products = []
    else:
        with open(PRODUCT_FILE, "r") as file:
            products = json.load(file)

    if os.path.exists(INVENTORY_FILE):

        with open(INVENTORY_FILE, "r") as file:
            history = json.load(file)

    else:
        history = []

    result = []

    for product in products:

        stock_out = sum(

            item["quantity"]

            for item in history

            if item["product_id"] == product["product_id"]

            and item["type"] == "Stock Out"

        )

        average_inventory = max(product["stock"], 1)

        turnover = round(stock_out / average_inventory, 2)

        result.append({

            "product_name": product["product_name"],

            "stock": product["stock"],

            "stock_out": stock_out,

            "turnover": turnover

        })

    return jsonify(result)
@product.route("/vendor/products/<vendor_id>")
def vendor_products(vendor_id):

    if not os.path.exists(PRODUCT_FILE):
        return jsonify([])

    with open(PRODUCT_FILE) as file:
        products = json.load(file)

    vendor_products = [

        p

        for p in products

        if p["vendor_id"] == vendor_id

    ]

    return jsonify(vendor_products)