import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import pymongo
import random
from flask import Flask, request, jsonify
from flask_cors import CORS


load_dotenv()


genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask("Health habit recommendation server")
CORS(app)

@app.route("/generate-habit-suggestions", methods=["POST"])
def generate_habit_recommendations():
    """
    Pass the user habits as a comma-separated string in the body of the POST request.
    Example: { "user_habits": "Walking,Gym" }
    """

    json_data = request.get_json()
    user_habits = json_data.get("user_habits", "")
    print("User habits:", user_habits)

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(f"""
        Generate only three health recommendations, based on the user’s health data. 

        The health habits provided by user are: {user_habits}

        If the health data is not provided give general health habit recommendations.

        Give the output as JSON objects with the following fields:
        title, description. Title should be as short as possible and should not match any habit from user_habits.

        DO NOT give any preamble or postamble.
        DO NOT use markdown format.
        Give exactly three health habit recommendations.

        OUTPUT EXAMPLE:
        [
            {{
                "title": "Drink Water",
                "description": "Drink 8 glasses of water daily."
            }},
            {{
                "title": "Exercise",
                "description": "Exercise for 30 minutes daily."
            }},
            {{
                "title": "Sleep",
                "description": "Get 8 hours of sleep daily."
            }}
        ]
        """)

        output = response.text
        return jsonify(json.loads(output))

    except Exception as e:
        print("Failed to get response from Gemini API:", e)

        try:
            mongo_client = pymongo.MongoClient(os.getenv("MONGO_URI"))
            db = mongo_client["recommendations"]
            collection = db["habits"]

            # Check if collection is empty
            habits_available = list(collection.find({}, {"_id": 0}))
            if not habits_available:
                collection.insert_many([
                    {
                        "title": "Balanced Diet",
                        "description": "Focus on a diet rich in fruits, vegetables, whole grains, and lean protein. Limit processed foods, sugary drinks, and unhealthy fats."
                    },
                    {
                        "title": "Regular Physical Activity",
                        "description": "Aim for at least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity aerobic activity per week, along with muscle-strengthening activities twice a week."
                    },
                    {
                        "title": "Prioritize Sleep",
                        "description": "Aim for 7-9 hours of quality sleep each night. Establish a regular sleep schedule and create a relaxing bedtime routine."
                    }
                ])
                habits_available = list(collection.find({}, {"_id": 0}))

            unique_habits = random.sample(habits_available, 3)
            return jsonify(unique_habits)

        except Exception as db_exception:
            print("Failed in processing MongoDB:", db_exception)
            return jsonify([])

if __name__ == "__main__":
    app.run(port=8081)
