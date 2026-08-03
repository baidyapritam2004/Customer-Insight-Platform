from flask import Blueprint, jsonify
import pandas as pd
import os
from datetime import datetime
customer = Blueprint("customer", __name__)

UPLOAD_FOLDER = "uploads"

@customer.route("/customer/summary", methods=["GET"])
def customer_summary():

    filepath = os.path.join(UPLOAD_FOLDER, "latest.csv")

    if not os.path.exists(filepath):
        return jsonify({})

    df = pd.read_csv(filepath)

    customers = len(df["customer_id"].unique())

    repeat_customers = df["customer_id"].value_counts()

    average_orders = round(repeat_customers.mean(),2)

    top_customer = repeat_customers.idxmax()

    return jsonify({

        "total_customers": customers,

        "repeat_customers": int((repeat_customers > 1).sum()),

        "average_orders": average_orders,

        "top_customer": top_customer

    })

@customer.route("/customer/segments", methods=["GET"])
def customer_segments():

    filepath = os.path.join(UPLOAD_FOLDER, "latest.csv")

    if not os.path.exists(filepath):
        return jsonify([])

    df = pd.read_csv(filepath)

    df["order_date"] = pd.to_datetime(df["order_date"])

    latest_date = df["order_date"].max()

    rfm = df.groupby("customer_id").agg({

        "order_date": lambda x: (latest_date - x.max()).days,

        "customer_id": "count",

        "price": "sum"

    })

    rfm.columns = ["Recency", "Frequency", "Monetary"]

    segments = []

    for customer_id, row in rfm.iterrows():

        if row["Monetary"] >= rfm["Monetary"].quantile(0.75):
            segment = "Premium"

        elif row["Frequency"] >= rfm["Frequency"].median():
            segment = "Loyal"

        elif row["Recency"] <= 30:
            segment = "Active"

        else:
            segment = "At Risk"

        segments.append({

            "customer_id": customer_id,

            "segment": segment,

            "recency": int(row["Recency"]),

            "frequency": int(row["Frequency"]),

            "monetary": round(row["Monetary"], 2)

        })

    return jsonify(segments)

@customer.route("/customer/all", methods=["GET"])
def get_all_customers():

    filepath = os.path.join(UPLOAD_FOLDER, "latest.csv")

    if not os.path.exists(filepath):
        return jsonify([])

    df = pd.read_csv(filepath)

    customers = (
        df.groupby("customer_id")
        .agg({
            "city": "first",
            "state": "first",
            "price": "sum",
            "quantity": "sum",
            "product_id": "count"
        })
        .reset_index()
    )

    customers.rename(
        columns={
            "price": "total_spent",
            "product_id": "total_orders",
            "quantity": "items_purchased"
        },
        inplace=True
    )

    result = []

    for _, row in customers.iterrows():

        result.append({

            "customer_id": row["customer_id"],

            "customer_name": f"Customer {row['customer_id']}",

            "city": row["city"],

            "state": row["state"],

            "total_orders": int(row["total_orders"]),

            "items_purchased": int(row["items_purchased"]),

            "total_spent": round(row["total_spent"], 2)

        })

    return jsonify(result)