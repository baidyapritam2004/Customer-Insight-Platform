import pandas as pd


def clean_data(df):

    # ==========================
    # Rows before cleaning
    # ==========================

    rows_before = len(df)

    # ==========================
    # Standardize column names
    # ==========================

    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    # ==========================
    # Remove duplicate rows
    # ==========================

    duplicates_removed = int(df.duplicated().sum())

    df = df.drop_duplicates()

    # ==========================
    # Remove completely empty rows
    # ==========================

    before = len(df)

    df = df.dropna(how="all")

    empty_rows_removed = before - len(df)

    # ==========================
    # Clean category
    # ==========================

    if "category" in df.columns:

        df["category"] = (
            df["category"]
            .astype(str)
            .str.strip()
            .str.title()
        )

    # ==========================
    # Clean product names
    # ==========================

    if "name" in df.columns:

        df["name"] = (
            df["name"]
            .astype(str)
            .str.strip()
        )

    # ==========================
    # Clean price
    # ==========================

    missing_prices_fixed = 0
    invalid_rows_removed = 0

    if "price" in df.columns:

        df["price"] = pd.to_numeric(
            df["price"],
            errors="coerce"
        )

        missing_prices_fixed = int(df["price"].isna().sum())

        df["price"] = df["price"].fillna(
            df["price"].median()
        )

        before = len(df)

        df = df[df["price"] >= 0]

        invalid_rows_removed = before - len(df)

    # ==========================
    # Clean rating
    # ==========================

    missing_ratings_fixed = 0

    if "rating" in df.columns:

        df["rating"] = pd.to_numeric(
            df["rating"],
            errors="coerce"
        )

        missing_ratings_fixed = int(df["rating"].isna().sum())

        df["rating"] = df["rating"].fillna(
            df["rating"].mean()
        )

        df["rating"] = df["rating"].clip(0, 5)

    # ==========================
    # Rows after cleaning
    # ==========================

    rows_after = len(df)

    # ==========================
    # Cleaning summary
    # ==========================

    summary = {

        "rows_before": rows_before,

        "rows_after": rows_after,

        "duplicates_removed": duplicates_removed,

        "empty_rows_removed": empty_rows_removed,

        "missing_prices_fixed": missing_prices_fixed,

        "missing_ratings_fixed": missing_ratings_fixed,

        "invalid_rows_removed": invalid_rows_removed

    }

    return df, summary