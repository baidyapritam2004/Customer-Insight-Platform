from flask import (
    Flask,
    request,
    jsonify,
    send_file,
    send_from_directory
)

from io import BytesIO
from flask_cors import CORS
import pandas as pd
import os

from analysis import analyze_data
from cleaning import clean_data
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER

from datetime import datetime
from prediction import predict_sales
from routes.auth import auth
from flask_bcrypt import Bcrypt
from routes.vendor import vendor
from routes.product import product
from flask import send_from_directory
from inventory_prediction import predict_inventory
from routes.sales import sales
from routes.customer import customer
from xgboost_prediction import predict_inventory_xgboost
from routes.dashboard import dashboard
from routes.settings import settings
from routes.vendor_dashboard import vendor_dashboard
from routes.order import order

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PRODUCT_IMAGE_FOLDER = os.path.join(
    BASE_DIR,
    "static",
    "product_images"
)

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)

os.makedirs(PRODUCT_IMAGE_FOLDER, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

bcrypt = Bcrypt(app)
app.register_blueprint(auth)
app.register_blueprint(vendor)
app.register_blueprint(product)
app.register_blueprint(sales)
app.register_blueprint(customer)
app.register_blueprint(dashboard)
app.register_blueprint(settings)
app.register_blueprint(vendor_dashboard)
app.register_blueprint(order)
app.config["UPLOAD_FOLDER"] = PRODUCT_IMAGE_FOLDER

# Enable CORS
CORS(app, origins=[
        "http://localhost:5173",
        "https://insightsync-ai-frontend.onrender.com/"
    ])



dashboard_data = {}


# ==========================
# Upload CSV
# ==========================

@app.route("/upload", methods=["POST"])
def upload():

    global dashboard_data

    if "file" not in request.files:
        return jsonify({"message": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"message": "No file selected"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, "latest.csv")

    file.save(filepath)

    # Read CSV
    df = pd.read_csv(filepath)

    # Clean Data
    df, cleaning_summary = clean_data(df)

    # Save cleaned CSV
    df.to_csv(filepath, index=False)

    # Generate dashboard data
    dashboard_data = analyze_data(df)

    dashboard_data["cleaning_summary"] = cleaning_summary

    return jsonify({
        "message": "Upload Successful",
        "cleaning_summary": cleaning_summary
    })


# ==========================
# Dashboard API
# ==========================

@app.route("/dashboard")
def dashboard():

    category = request.args.get("category", "All")

    filepath = os.path.join(UPLOAD_FOLDER, "latest.csv")
    
    if not os.path.exists(filepath):

        return jsonify({

            "kpis": {
                "total_customers": 0,
                "total_sales": 0,
                "average_sale": 0,
                "top_category": "N/A"
            },

            "charts": {
                "revenue_trend": [],
                "customer_growth": [],
                "customer_segments": [],
                "category_sales": []
            },

            "customers": [],
            "top_products": [],
            "categories": [],

            "insights": [
                {
                    "title": "No Data",
                    "text": "Please upload a CSV file first."
                }
            ],

            "cleaning_summary": {}
        })

    # Read already cleaned CSV
    df = pd.read_csv(filepath)

    result = analyze_data(df, category)

    prediction = predict_sales(df)
    
    # Get sales growth from the KPI data
    sales_growth = result["kpis"].get("sales_growth", 0)

    result["prediction"] = {

        "next_month_sales": round(float(prediction), 2),

        "growth": sales_growth,

        "confidence": 91,

        "model": "Linear Regression",

        "period": "Next 30 Days",

        "updated": datetime.now().strftime("%d %b %Y")

    }

    inventory_prediction = predict_inventory(df)
    result["inventory_prediction"] = {

    "required_stock": inventory_prediction,

    "algorithm":"Random Forest",

    "accuracy":"91%"

}

    xgb_prediction = predict_inventory_xgboost(df)
    result["inventory_prediction"] = {

    "random_forest": inventory_prediction,

    "xgboost": xgb_prediction,

    "best_model": "XGBoost" if xgb_prediction > inventory_prediction else "Random Forest"

}
    

    # Category list
    if "category" in df.columns:
        result["categories"] = sorted(
            df["category"].dropna().unique().tolist()
        )
    else:
        result["categories"] = []

   
    import json

    print(json.dumps(result, indent=2, default=str))
    return jsonify(result)

@app.route("/export/csv")
def export_csv():

    filepath = os.path.join(UPLOAD_FOLDER, "latest.csv")

    if not os.path.exists(filepath):
        return jsonify({"message": "No file uploaded"}), 404

    return send_file(
        filepath,
        as_attachment=True,
        download_name="Customer_Insight_Report.csv",
        mimetype="text/csv"
    )

@app.route("/export/pdf")
def export_pdf():

    filepath = os.path.join(UPLOAD_FOLDER, "latest.csv")

    if not os.path.exists(filepath):
        return jsonify({"message": "No file uploaded"}), 404

    df = pd.read_csv(filepath)

    dashboard = analyze_data(df)

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=(8.27 * inch, 11.69 * inch)
    )

    styles = getSampleStyleSheet()

    title_style = styles["Heading1"]
    title_style.alignment = TA_CENTER

    heading = styles["Heading2"]
    normal = styles["BodyText"]

    elements = []

    # ==========================
    # Title
    # ==========================

    elements.append(
        Paragraph(
            "InsightSync AI Report",
            title_style
        )
    )

    elements.append(
        Paragraph(
            f"Generated on: {datetime.now().strftime('%d-%m-%Y %H:%M:%S')}",
            normal
        )
    )

    elements.append(Spacer(1, 0.3 * inch))

    # ==========================
    # KPI Section
    # ==========================

    elements.append(
        Paragraph("Key Performance Indicators", heading)
    )

    kpis = dashboard["kpis"]

    kpi_table = Table([

        ["Metric", "Value"],

        ["Total Products", kpis["total_customers"]],

        ["Total Sales", f"₹{kpis['total_sales']:.2f}"],

        ["Average Price", f"₹{kpis['average_sale']:.2f}"],

        ["Top Category", kpis["top_category"]]

    ])

    kpi_table.setStyle(TableStyle([

        ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),

        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),

        ("GRID", (0, 0), (-1, -1), 1, colors.black),

        ("BACKGROUND", (0, 1), (-1, -1), colors.beige),

        ("ALIGN", (0, 0), (-1, -1), "CENTER"),

        ("BOTTOMPADDING", (0, 0), (-1, 0), 10),

    ]))

    elements.append(kpi_table)

    elements.append(Spacer(1, 0.3 * inch))

    # ==========================
    # AI Insights
    # ==========================

    elements.append(
        Paragraph("AI Insights", heading)
    )

    for insight in dashboard["insights"]:

        elements.append(

            Paragraph(

                f"<b>{insight['title']}</b><br/>{insight['text']}",

                normal

            )

        )

        elements.append(Spacer(1, 0.1 * inch))

    # ==========================
    # Top Products
    # ==========================

    elements.append(Spacer(1, 0.2 * inch))

    elements.append(
        Paragraph("Top Products", heading)
    )

    product_table = [[

        "Product",

        "Category",

        "Price",

        "Rating"

    ]]

    for product in dashboard["top_products"]:

        product_table.append([

            product["Product"],

            product["Category"],

            f"₹{product['Price']:.2f}",

            product["Rating"]

        ])

    table = Table(product_table)

    table.setStyle(TableStyle([

        ("BACKGROUND", (0, 0), (-1, 0), colors.darkgreen),

        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),

        ("GRID", (0, 0), (-1, -1), 1, colors.black),

        ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),

        ("ALIGN", (0, 0), (-1, -1), "CENTER"),

    ]))

    elements.append(table)

    # ==========================
    # Footer
    # ==========================

    elements.append(Spacer(1, 0.5 * inch))

    elements.append(

        Paragraph(

            "<b>Customer Insight Platform</b><br/>Generated using Flask, Pandas & React",

            normal

        )

    )

    doc.build(elements)

    buffer.seek(0)

    return send_file(

        buffer,

        as_attachment=True,

        download_name="Customer_Insight_Report.pdf",

        mimetype="application/pdf"

    )


@app.route("/export/excel")
def export_excel():

    filepath = os.path.join(UPLOAD_FOLDER, "latest.csv")

    if not os.path.exists(filepath):
        return jsonify({"message": "No file uploaded"}), 404

    df = pd.read_csv(filepath)

    output = BytesIO()

    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Products")

    output.seek(0)

    return send_file(
        output,
        download_name="Customer_Insight_Report.xlsx",
        as_attachment=True,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

@app.route("/product-images/<filename>")
def product_images(filename):
    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )

# ==========================
# Run Server
# ==========================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000))
    )