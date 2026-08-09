import json
import os
import uuid
from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
import jwt
from datetime import datetime, timedelta

auth = Blueprint("auth", __name__)
bcrypt = Bcrypt()

USERS_FILE = "users.json"
VENDOR_FILE = "vendors.json"

SECRET_KEY = "customer_insight_platform_secret"


# =========================
# Signup
# =========================

@auth.route("/signup", methods=["GET", "POST"])
def signup():

    if request.method == "GET":
        return jsonify({
            "message": "Signup route is working"
        })

    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "Vendor")

    if not name or not email or not password:
        return jsonify({
            "message": "All fields are required."
        }), 400

    # ---------- USERS ----------
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r") as file:
            users = json.load(file)
    else:
        users = []

    for user in users:
        if user["email"] == email:
            return jsonify({
                "message": "Email already exists."
            }), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    users.append({
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": role
    })

    with open(USERS_FILE, "w") as file:
        json.dump(users, file, indent=4)

    # ---------- VENDORS ----------
    if role == "Vendor":

        if os.path.exists(VENDOR_FILE):
            with open(VENDOR_FILE, "r") as file:
                vendors = json.load(file)
        else:
            vendors = []

        vendor_id = str(uuid.uuid4())[:8]

        vendors.append({
            "vendor_id": vendor_id,
            "name": name,
            "email": email
        })

        with open(VENDOR_FILE, "w") as file:
            json.dump(vendors, file, indent=4)

    return jsonify({
        "message": "Account created successfully."
    })

# =========================
# Login
# =========================

@auth.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "GET":

        return jsonify({
            "message": "Login route is working"
        })

    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:

        return jsonify({
            "message": "Email and password are required."
        }), 400

    if not os.path.exists(USERS_FILE):

        return jsonify({
            "message": "No users found."
        }), 404

    with open(USERS_FILE, "r") as file:

        users = json.load(file)

    user = next(

        (
            u for u in users
            if u["email"] == email
        ),

        None

    )

    if not user:

        return jsonify({
            "message": "Invalid email or password."
        }), 401

    if not bcrypt.check_password_hash(user["password"], password):

        return jsonify({
            "message": "Invalid email or password."
        }), 401

    # ==========================
    # Find Vendor ID
    # ==========================

    vendor_id = None

    if user["role"] == "Vendor":

        if os.path.exists(VENDOR_FILE):

            with open(VENDOR_FILE, "r") as file:

                vendors = json.load(file)

            vendor = next(

                (
                    v for v in vendors
                    if v["email"] == email
                ),

                None

            )

            if vendor:

                vendor_id = vendor["vendor_id"]

    token = jwt.encode(

        {

            "email": user["email"],

            "role": user["role"],

            "exp": datetime.utcnow() + timedelta(hours=24)

        },

        SECRET_KEY,

        algorithm="HS256"

    )

    return jsonify({

        "message": "Login successful.",

        "token": token,

        "user": {

            "name": user["name"],

            "email": user["email"],

            "role": user["role"],

            "vendor_id": vendor_id

        }

    })