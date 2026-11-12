from flask import Flask, jsonify
import json
import os

app = Flask(__name__)

DATA_FILE = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "scraped_data.json"
)


@app.route("/", methods=["GET"])
def home():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)

        return jsonify(data)

    except FileNotFoundError:
        return jsonify({
            "error": "Scraped data file not found"
        }), 404

    except json.JSONDecodeError:
        return jsonify({
            "error": "Invalid JSON file"
        }), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
