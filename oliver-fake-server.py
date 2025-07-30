from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import random

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

if __name__ == "__main__":
    app.run(port=5000)
