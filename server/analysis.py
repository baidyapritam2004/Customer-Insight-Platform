import pandas as pd
from datetime import datetime

def generate_insights(df):
    insights = []

    # Safe check if dataframe is empty
    if df.empty:
        return insights

    # Top category
    if "category" in df.columns and not df["category"].dropna().empty:
        top_category = df["category"].mode().iloc[0]
        insights.append(
            {
                "title": "Best Performing Category",
                "text": f"{top_category} has the highest number of products.",
            }
        )

    # Average price
    if "price" in df.columns:
        avg_price = df["price"].mean()
        insights.append(
            {
                "title": "Pricing",
                "text": f"The average product price is ₹{avg_price:.2f}.",
            }
        )

    # Highest priced product
    if {"name", "price"}.issubset(df.columns) and not df["price"].dropna().empty:
        highest = df.loc[df["price"].idxmax()]
        insights.append(
            {
                "title": "Premium Product",
                "text": f"{highest['name']} is the highest priced product (₹{highest['price']:.2f}).",
            }
        )

    # Rating
    if "rating" in df.columns:
        avg_rating = df["rating"].mean()
        if avg_rating >= 4:
            message = "Customer satisfaction is excellent."
        elif avg_rating >= 3:
            message = "Customer satisfaction is average."
        else:
            message = "Customer satisfaction needs improvement."

        insights.append({"title": "Customer Satisfaction", "text": message})

    return insights


def analyze_data(df, category=None):
    # ==========================
    # FILTER BY CATEGORY
    # ==========================
    if category and category != "All" and "category" in df.columns:
        df = df[df["category"] == category]

    # ==========================
    # KPI SECTION
    # ==========================

    total_products = len(df)
    total_sales = 0
    average_price = 0

    if "price" in df.columns:
        total_sales = float(df["price"].sum())
        average_price = float(df["price"].mean())

    top_category = "N/A"
    if (
        "category" in df.columns
        and not df.empty
        and not df["category"].dropna().empty
    ):
        top_category = df["category"].mode().iloc[0]

    average_rating = 0
    if "rating" in df.columns:
        average_rating = float(df["rating"].mean())


    # =====================================
    # Dynamic Growth Calculations
    # =====================================

    sales_growth = 0
    customer_growth = 0
    average_growth = 0

    if "order_date" in df.columns:

        df["order_date"] = pd.to_datetime(df["order_date"])

        df["month"] = df["order_date"].dt.strftime("%Y-%m")

        monthly = (
            df.groupby("month")
            .agg(
                sales=("price", "sum"),
                customers=("customer_id", "nunique"),
                average=("price", "mean"),
            )
            .reset_index()
        )

        if len(monthly) >= 2:

            previous = monthly.iloc[-2]
            current = monthly.iloc[-1]

            # Sales Growth
            if previous["sales"] != 0:
                sales_growth = (
                    (current["sales"] - previous["sales"])
                    / previous["sales"]
                ) * 100

            # Customer Growth
            if previous["customers"] != 0:
                customer_growth = (
                    (current["customers"] - previous["customers"])
                    / previous["customers"]
                ) * 100

            # Average Sale Growth
            if previous["average"] != 0:
                average_growth = (
                    (current["average"] - previous["average"])
                    / previous["average"]
                ) * 100


    kpis = {

        "total_customers": total_products,

        "total_sales": round(total_sales, 2),

        "average_sale": round(average_price, 2),

        "top_category": top_category,

        "sales_growth": round(sales_growth, 1),

        "customer_growth": round(customer_growth, 1),

        "average_growth": round(average_growth, 1)

    }
    # ==========================
    # CHART DATA
    # ==========================
    charts = {}

    # Category Sales
    if {"category", "price"}.issubset(df.columns):
        category_sales = df.groupby("category")["price"].sum().reset_index()
        charts["category_sales"] = [
            {"category": row["category"], "sales": float(row["price"])}
            for _, row in category_sales.iterrows()
        ]
    else:
        charts["category_sales"] = []
    # ==========================
    # Sales by State
    # ==========================

    if {"state", "price"}.issubset(df.columns):

        state_sales = (
            df.groupby("state")["price"]
            .sum()
            .reset_index()
            .sort_values(by="price", ascending=False)
        )

        charts["sales_by_state"] = [

            {
                "state": row["state"],
                "sales": float(row["price"])
            }

            for _, row in state_sales.iterrows()

        ]

    else:

        charts["sales_by_state"] = []


    # ==========================
    # Sales by City
    # ==========================
    
    if {"city", "price"}.issubset(df.columns):
    
        city_sales = (
            df.groupby("city")["price"]
            .sum()
            .reset_index()
            .sort_values(by="price", ascending=False)
        )
    
        charts["sales_by_city"] = [
        
            {
                "city": row["city"],
                "sales": float(row["price"])
            }
    
            for _, row in city_sales.iterrows()
    
        ]
    
    else:
    
        charts["sales_by_city"] = []



    # Customer Segments
    if "category" in df.columns:
        segment = df["category"].value_counts().reset_index()
        segment.columns = ["category", "count"]
        charts["customer_segments"] = [
            {"name": row["category"], "value": int(row["count"])}
            for _, row in segment.iterrows()
        ]
    else:
        charts["customer_segments"] = []

    # ==========================
    # Revenue Trend
    # ==========================

    if {"order_date", "price"}.issubset(df.columns):

        temp = df.copy()

        temp["order_date"] = pd.to_datetime(
            temp["order_date"],
            errors="coerce"
        )

        temp = temp.dropna(subset=["order_date"])

        temp["month"] = temp["order_date"].dt.month_name().str[:3]

        revenue = (
            temp.groupby("month")["price"]
            .sum()
            .reset_index()
        )

        month_order = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]

        revenue["month"] = pd.Categorical(
            revenue["month"],
            categories=month_order,
            ordered=True
        )

        revenue = revenue.sort_values("month")

        charts["revenue_trend"] = [
            {
                "month": row["month"],
                "revenue": float(row["price"])
            }
            for _, row in revenue.iterrows()
        ]

    else:

        charts["revenue_trend"] = []

    # ==========================
    # Customer Growth
    # ==========================

    if {"customer_id", "order_date"}.issubset(df.columns):

        temp = df.copy()

        temp["order_date"] = pd.to_datetime(
            temp["order_date"],
            errors="coerce"
        )

        temp = temp.dropna(subset=["order_date"])

        temp["month"] = temp["order_date"].dt.month_name().str[:3]

        growth = (
            temp.groupby("month")["customer_id"]
            .nunique()
            .reset_index()
        )

        growth["month"] = pd.Categorical(
            growth["month"],
            categories=month_order,
            ordered=True
        )

        growth = growth.sort_values("month")

        charts["customer_growth"] = [
            {
                "month": row["month"],
                "customers": int(row["customer_id"])
            }
            for _, row in growth.iterrows()
        ]

    else:

        charts["customer_growth"] = []

    # ==========================
    # CUSTOMER TABLE
    # ==========================

    preview = df.head(10).fillna("").to_dict(orient="records")

    customers = []

    for _, row in df.iterrows():

        customers.append({

            "Product ID": row.get("product_id", ""),
            "Product Name": row.get("name", ""),
            "Category": row.get("category", ""),
            "Price": float(row.get("price", 0)),
            "Rating": float(row.get("rating", 0))

        })

    # ==========================
    # TOP PRODUCTS
    # ==========================

    top_products = []

    if {"name", "category", "price", "rating"}.issubset(df.columns):

        top_df = (
            df.sort_values(
                by=["rating", "price"],
                ascending=False
            )
            .head(10)
        )

        top_products = [

            {

                "Product": row["name"],
                "Category": row["category"],
                "Price": float(row["price"]),
                "Rating": float(row["rating"])

            }

            for _, row in top_df.iterrows()

        ]

    # ==========================
    # AI INSIGHTS
    # ==========================

    insights = generate_insights(df)

    recommendations = []

    if average_rating < 4:
        recommendations.append({
            "title": "Improve Product Ratings",
            "text": "Focus on improving customer satisfaction for low-rated products."
        })

    if total_products > 100:
        recommendations.append({
            "title": "Large Inventory",
            "text": "Consider identifying slow-moving products and optimizing inventory."
        })

    if top_category != "N/A":
        recommendations.append({
            "title": "Top Category",
            "text": f"Increase marketing investment in {top_category} products."
        })

    if average_price > 5000:
        recommendations.append({
            "title": "Premium Pricing",
            "text": "High average prices suggest targeting premium customers."
        })

    # ==========================
    # CATEGORY LIST
    # ==========================

    if "category" in df.columns:

        all_categories = sorted(
            df["category"]
            .dropna()
            .unique()
            .tolist()
        )

    else:

        all_categories = []



    summary = {}

    summary["products"] = len(df)

    summary["categories"] = (
        df["category"].nunique()
        if "category" in df.columns
        else 0
    )

    summary["highest_price"] = (
        float(df["price"].max())
        if "price" in df.columns
        else 0
    )

    summary["lowest_price"] = (
        float(df["price"].min())
        if "price" in df.columns
        else 0
    )

    summary["average_rating"] = (
        round(df["rating"].mean(), 2)
        if "rating" in df.columns
        else 0
    )


    dashboard_info = {

    "dataset_name": "latest.csv",

    "last_updated": datetime.now().strftime("%d %b %Y %I:%M %p"),

    "notification_count": 4,

    "user_name": "Pritam Baidya",

    "role": "Administrator",

    "notifications": [

        {
            "title": "Dataset Uploaded",
            "time": "2 minutes ago"
        },

        {
            "title": "Sales Prediction Generated",
            "time": "5 minutes ago"
        },

        {
            "title": "Dashboard Updated",
            "time": "10 minutes ago"
        },

        {
            "title": "PDF Report Exported",
            "time": "Today"
        }

    ]

}

    cleaning_summary = {

    "total_rows": int(len(df)),

    "total_columns": int(len(df.columns)),

    "missing_values": int(df.isnull().sum().sum()),

    "duplicate_rows": int(df.duplicated().sum()),

    "invalid_entries": 0,

    "quality_score": float(
        round(
            (
                1
                -
                (
                    df.isnull().sum().sum()
                    +
                    df.duplicated().sum()
                )
                /
                max(len(df), 1)
            ) * 100,
            1
        )
    )

}

    # ==========================
    # RETURN DATA
    # ==========================

    return {

    "kpis": kpis,

    "charts": charts,

    "customers": customers,

    "top_products": top_products,

    "insights": insights,

    "recommendations": recommendations,

    "categories": all_categories,

    "preview": preview,

    "summary": summary,
     "cleaning_summary": cleaning_summary,
    "dashboard_info": dashboard_info

}