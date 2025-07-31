from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import random
import json

app = Flask(__name__)
CORS(app)
def generate_mock_current_detail(symbol, days=90):
    current_detail = {
        "name": "Mock Corp",
        "symbol": symbol.upper(),
        "open": [],
        "close": [],
        "high": [],
        "low": [],
        "timestamps": []
    }

    price = 180 + random.uniform(0, 10)
    date = datetime.today() - timedelta(days=days + 10)


    count = 0
    while count < days:
        if date.weekday() >= 5:  # skip weekends
            date += timedelta(days=1)
            continue

        open_price = price
        change = (random.random() - 0.45) * 2
        close_price = open_price + change
        high_price = max(open_price, close_price) + random.uniform(0, 1.5)
        low_price = min(open_price, close_price) - random.uniform(0, 1.5)

        current_detail["open"].append(round(open_price, 2))
        current_detail["close"].append(round(close_price, 2))
        current_detail["high"].append(round(high_price, 2))
        current_detail["low"].append(round(low_price, 2))
        current_detail["timestamps"].append(date.strftime("%Y-%m-%d"))

        price = close_price
        date += timedelta(days=1)
        count += 1
    

    return current_detail

@app.route("/v1/asset/<symbol>")
def get_asset(symbol):
    data = generate_mock_current_detail(symbol)
    print("Mock data generated for symbol:", symbol)
    return jsonify(data)

ticker_to_name = {
    "AAPL": "Apple Inc.",
    "GOOG": "Alphabet Inc.",
    "AMZN": "Amazon.com Inc.",
    "TSLA": "Tesla Inc.",
    "MSFT": "Microsoft Corporation",
    "BIL": "SPDR Bloomberg 1-3 Month T-Bill ETF",
    "SHV": "iShares Short Treasury Bond ETF",
    "ICSH": "iShares Ultra Short-Term Bond ETF",
    "GC=F": "Gold Futures",
    "BTC-USD": "Bitcoin USD"
}

@app.route("/v1/asset/sentiment/")
def get_sentiment():
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    # 假设news只考虑一下assets，比较出名，可以代表整体风向。
    # 需要把一下内容转化为sql，取出前一天的新闻全部新闻作为data。
    assets = ["AAPL", "GOOG", "AMZN", "TSLA", "MSFT", "BIL", "SHV", "ICSH", "GC=F", "BTC-USD"]
    with open("news_sentiment.json", "r") as fread:
        data = json.load(fread)


    asset_sentiments = {asset: [] for asset in assets}
    asset_news = {asset: [] for asset in assets}

    for item in data:
        ticker = item["ticker"]
        sentiment = item["sentiment"]
        published_date = item["published"]

        if ticker in assets and published_date == yesterday:
            asset_sentiments[ticker].append(sentiment)
            asset_news[ticker].append(item) 
    

    avg_sentiments = {
        asset: sum(sentiments) / len(sentiments)
        for asset, sentiments in asset_sentiments.items() if sentiments
    }

    positive_assets = {asset: avg for asset, avg in avg_sentiments.items() if avg > 0.5}
    negative_assets = {asset: avg for asset, avg in avg_sentiments.items() if avg < 0.5}

    most_positive = sorted(positive_assets.items(), key=lambda x: x[1], reverse=True)[:3]
    most_negative = sorted(negative_assets.items(), key=lambda x: x[1])[:3]

    print(most_positive)

    real_data = {
        "topPositive": [],
        "topNegative": []
    }

    for item in most_positive:
        most_positive_item_news = sorted(asset_news[item[0]], key=lambda x: x["sentiment"], reverse=True)[:3]
        real_data["topPositive"].append({
            "ticker": item[0],
            "name": ticker_to_name[item[0]],
            "score": item[1],
            "news": [
                {
                    "title": x["title"],
                    "url": x["link"]
                } for x in most_positive_item_news
            ]
        })

    return jsonify(real_data)


if __name__ == "__main__":
    app.run(port=5000)