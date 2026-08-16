from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

model = joblib.load('Mental_Health_Model.pkl')
top_countries = ['Other', 'India', 'USA', 'Canada', 'Australia', 'UK', 'Germany', 'Mexico', 'Turkey', 'France']

# 1. Root route par JSON ke bajaye HTML Template serve karein
@app.route('/')
def home():
    return render_template('index.html')

# 2. Prediction Endpoint (Yeh pehle jaisa hi rahega)
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        country = data.get('country', '')
        country_group = country if country in top_countries else "Other"

        input_row = pd.DataFrame([{
            'Age': int(data['age']),
            'Gender': data['gender'],
            'Country': country_group,
            'Academic_Level': data['academic_level'],
            'Most_Used_Platform': data['most_used_platform'],
            'Purpose_Of_Use': data['purpose_of_use'],
            'Avg_Daily_Usage_Hours': float(data['avg_daily_usage_hours']),
            'Daily_Unlocks': int(data['daily_unlocks']),
            'Study_Hours': float(data['study_hours']),
            'Physical_Activity_Hours': float(data['physical_activity_hours']),
            'Sleep_Hours_Per_Night': float(data['sleep_hours_per_night']),
            'Stress_Level': data['stress_level'],
            'Grouped_country': country_group
        }])

        prediction = model.predict(input_row)[0]
        return jsonify({'predicted_mental_health_score': round(float(prediction), 2)})

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)