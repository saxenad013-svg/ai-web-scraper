from flask import Flask, request, jsonify
from flask_cors import CORS

from scrape import (
    scrape_website,
    extract_body_content,
    clean_body_content,
    split_dom_content
)

from parse import parse_with_ollama


app = Flask(__name__)

# Allow the React frontend to communicate with Python
CORS(app)


# ============================================================
# TEST ROUTE
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "status": "online",
        "message": "Fieldglass Python backend is running!"
    })


# ============================================================
# SCRAPE WEBSITE
# ============================================================

@app.route("/scrape", methods=["POST"])
def scrape():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "error": "No data received."
            }), 400


        url = data.get("url", "").strip()


        if not url:

            return jsonify({
                "error": "Please provide a website URL."
            }), 400


        print(f"Scraping: {url}")


        # Run your existing scraper
        result = scrape_website(url)


        if result is None:

            return jsonify({
                "error": "Unable to scrape the website."
            }), 400


        # Extract page body
        body_content = extract_body_content(result)


        if not body_content:

            return jsonify({
                "error": "No readable content was found."
            }), 400


        # Clean the content
        cleaned_content = clean_body_content(
            body_content
        )


        if not cleaned_content:

            return jsonify({
                "error": "The webpage contained no readable text."
            }), 400


        return jsonify({
            "success": True,
            "content": cleaned_content
        })


    except Exception as e:

        print("SCRAPE ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# AI ANALYSIS
# ============================================================

@app.route("/analyze", methods=["POST"])
def analyze():

    try:

        data = request.get_json()


        if not data:

            return jsonify({
                "error": "No data received."
            }), 400


        content = data.get("content", "")
        description = data.get("description", "")


        if not content:

            return jsonify({
                "error": "No scraped content was provided."
            }), 400


        if not description:

            return jsonify({
                "error": "Please provide an extraction instruction."
            }), 400


        print("Sending webpage content to AI...")


        # Split webpage into chunks
        chunks = split_dom_content(
            content
        )


        # Run your existing AI parser
        parsed_result = parse_with_ollama(
            chunks,
            description
        )


        return jsonify({
            "success": True,
            "result": parsed_result
        })


    except Exception as e:

        print("AI ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    print("")
    print("======================================")
    print("      FIELDGLASS PYTHON BACKEND")
    print("======================================")
    print("")
    print("Backend running at:")
    print("http://127.0.0.1:5000")
    print("")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )