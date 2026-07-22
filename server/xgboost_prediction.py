import pandas as pd
from xgboost import XGBRegressor

def predict_inventory_xgboost(df):

    df = df.copy()

    df["month_num"] = pd.to_datetime(df["order_date"]).dt.month

    X = df[[
        "price",
        "rating",
        "quantity",
        "month_num"
    ]]

    y = df["quantity"]

    model = XGBRegressor(

        n_estimators=100,

        learning_rate=0.1,

        max_depth=5,

        random_state=42

    )

    model.fit(X, y)

    sample = [[

        600,

        4.5,

        20,

        8

    ]]

    prediction = model.predict(sample)[0]

    return round(float(prediction), 2)