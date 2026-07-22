import pandas as pd
from sklearn.linear_model import LinearRegression


def predict_sales(df):

    if not {"order_date", "price"}.issubset(df.columns):
        return None

    temp = df.copy()

    temp["order_date"] = pd.to_datetime(
        temp["order_date"],
        errors="coerce"
    )

    temp = temp.dropna(subset=["order_date"])

    if temp.empty:
        return None

    monthly = (
        temp.groupby(
            temp["order_date"].dt.to_period("M")
        )["price"]
        .sum()
        .reset_index()
    )

    monthly["month"] = range(1, len(monthly) + 1)

    X = monthly[["month"]]
    y = monthly["price"]

    if len(monthly) < 2:
        return None

    model = LinearRegression()
    model.fit(X, y)

    next_month = [[len(monthly) + 1]]

    prediction = model.predict(next_month)[0]

    return round(float(prediction), 2)