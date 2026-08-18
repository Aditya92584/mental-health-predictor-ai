# 🧠 Mental Health Score Prediction

An end-to-end Data Science and Machine Learning web application designed to evaluate lifestyle, behavioral, and work-related parameters to predict an individual's mental health score. This project demonstrates a complete ML workflow—from data preprocessing and model building to backend deployment using Python, Flask, and Gunicorn on Render.

---

## 🚀 Live Demo & Repository

* **Live Application:** [Click here for live link ](https://mental-health-score-prediction-2kxv.onrender.com)
* **GitHub Repository:** [Click here for Repository link](https://github.com/Aditya92584/Mental_Health_Score_Prediction)

---

## 📌 Problem Statement & Objective

Mental well-being is heavily influenced by daily routines, work environments, and lifestyle choices. The objective of this project is to provide a predictive tool that takes user-reported behavioral factors and provides an estimated mental health assessment score. 

By automating model inference through a lightweight web API, users can receive instant insights into how various lifestyle factors impact their overall score.

---

## ✨ Key Features

* **Real-Time Prediction Engine:** Computes prediction scores dynamically based on user input.
* **Robust ML Pipeline:** Integrates custom feature transformations, missing value imputation, categorical encoding, and feature scaling using `scikit-learn`.
* **RESTful Web Service:** Light-weight backend built with **Flask** to handle incoming request payloads and serve web forms/predictions.
* **Production-Grade Deployment:** Configured with **Gunicorn** WSGI server on **Render** to ensure stable multi-threaded request handling.
* **Automated CI/CD:** Continuous deployment integration directly connected to GitHub repository commits.

---

## 🛠️ System Architecture & Tech Stack

### Technology Stack
* **Language:** Python 3.14
* **Machine Learning & Data Processing:** Scikit-Learn (v1.8.0), Pandas, NumPy, Joblib
* **Web Framework & Server:** Flask, Flask-CORS, Gunicorn
* **Deployment Platform:** Render Cloud Services
* **Version Control:** Git & GitHub

### Application Flow
1. **User Interface:** User submits inputs through the frontend form.
2. **Flask Backend:** Captures HTTP requests, formats data into appropriate DataFrames, and passes it to the ML Pipeline.
3. **Model Inference:** Load serialized `model.pkl` pipeline to scale, encode, and predict scores.
4. **Response Delivery:** Transmits predicted result back to user interface.

---

## 📁 Project Structure

```text
Mental_Health_Score_Prediction/
├── main.py              # Main Flask application with routing logic
├── model.pkl            # Serialized trained Machine Learning Pipeline
├── requirements.txt     # Complete list of Python dependencies
├── templates/           # HTML user interface templates
│   └── index.html       # Web form interface
├── static/              # CSS/JS asset files (if applicable)
└── README.md            # Comprehensive project documentation
