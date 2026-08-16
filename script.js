document.addEventListener("DOMContentLoaded", () => {
    // API Endpoint
    const API_URL = "https://mental-health-score-prediction-1-bswd.onrender.com";

    // DOM Elements
    const form = document.getElementById("prediction-form");
    const predictBtn = document.getElementById("predict-btn");
    const btnSpinner = document.getElementById("btn-spinner");
    const btnText = predictBtn.querySelector(".btn-text");
    
    const resultCard = document.getElementById("result-card");
    const scoreValue = document.getElementById("score-value");
    const scoreInterpretation = document.getElementById("score-interpretation");
    const interpretationBox = document.getElementById("interpretation-box");
    const predictAgainBtn = document.getElementById("predict-again-btn");
    
    const errorAlert = document.getElementById("error-alert");
    const errorMessage = document.getElementById("error-message");
    const closeErrorBtn = document.getElementById("close-error");

    // Close error alert listener
    if (closeErrorBtn) {
        closeErrorBtn.addEventListener("click", () => {
            errorAlert.classList.add("hidden");
        });
    }

    // Smooth scroll for "Predict Again" button
    if (predictAgainBtn) {
        predictAgainBtn.addEventListener("click", () => {
            resultCard.classList.add("hidden");
            form.scrollIntoView({ behavior: "smooth" });
        });
    }

    // Form submission handler
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Clear previous error states
        hideError();
        clearFormErrors();

        // Form Validation
        if (!validateForm()) {
            return;
        }

        // Construct Request Body matching Pydantic Model exactly
        const requestData = {
            age: Number(document.getElementById("age").value),
            gender: document.getElementById("gender").value,
            country: document.getElementById("country").value.trim(),
            academic_level: document.getElementById("academic_level").value,
            most_used_platform: document.getElementById("most_used_platform").value,
            purpose_of_use: document.getElementById("purpose_of_use").value,
            avg_daily_usage_hours: Number(document.getElementById("avg_daily_usage_hours").value),
            daily_unlocks: Number(document.getElementById("daily_unlocks").value),
            study_hours: Number(document.getElementById("study_hours").value),
            physical_activity_hours: Number(document.getElementById("physical_activity_hours").value),
            sleep_hours_per_night: Number(document.getElementById("sleep_hours_per_night").value),
            stress_level: document.getElementById("stress_level").value
        };

        // Set Loading State
        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const detailMsg = errorData && errorData.detail 
                    ? (Array.isArray(errorData.detail) ? errorData.detail[0].msg : errorData.detail)
                    : `Server returned status code ${response.status}`;
                throw new Error(detailMsg);
            }

            const data = await response.json();

            if (data && typeof data.predicted_mental_health_score !== "undefined") {
                displayResult(data.predicted_mental_health_score);
            } else {
                throw new Error("Invalid response format received from server.");
            }

        } catch (error) {
            console.error("Prediction Error:", error);
            if (error.name === "TypeError" && error.message.includes("Fetch")) {
                showError("Unable to connect to the prediction server. Please make sure the FastAPI backend is running.");
            } else {
                showError(error.message || "An unexpected error occurred while making the prediction.");
            }
        } finally {
            setLoading(false);
        }
    });

    // Helper: Form Validation
    function validateForm() {
        let isValid = true;
        const requiredInputs = form.querySelectorAll("[required]");

        requiredInputs.forEach((input) => {
            if (!input.value || input.value.trim() === "") {
                markInputError(input, "This field is required.");
                isValid = false;
            } else if (input.type === "number") {
                const val = Number(input.value);
                const min = input.hasAttribute("min") ? Number(input.getAttribute("min")) : null;
                const max = input.hasAttribute("max") ? Number(input.getAttribute("max")) : null;

                if (min !== null && val < min) {
                    markInputError(input, `Value must be at least ${min}.`);
                    isValid = false;
                } else if (max !== null && val > max) {
                    markInputError(input, `Value must not exceed ${max}.`);
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    function markInputError(input, message) {
        input.classList.add("input-error");
        const parent = input.parentElement;
        let errorSpan = parent.querySelector(".error-text");
        if (!errorSpan) {
            errorSpan = document.createElement("span");
            errorSpan.className = "error-text";
            parent.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
    }

    function clearFormErrors() {
        const errorInputs = form.querySelectorAll(".input-error");
        errorInputs.forEach((input) => input.classList.remove("input-error"));

        const errorTexts = form.querySelectorAll(".error-text");
        errorTexts.forEach((span) => span.remove());
    }

    // Helper: UI Loading Toggle
    function setLoading(isLoading) {
        if (isLoading) {
            predictBtn.disabled = true;
            btnText.textContent = "Analyzing...";
            btnSpinner.classList.remove("hidden");
        } else {
            predictBtn.disabled = false;
            btnText.textContent = "Predict Mental Health Score";
            btnSpinner.classList.add("hidden");
        }
    }

    // Helper: Display Prediction Results
    function displayResult(score) {
        const formattedScore = Number(score).toFixed(2);
        scoreValue.textContent = formattedScore;

        // Reset interpretation classes
        interpretationBox.className = "interpretation-box";

        // Determine score color & text
        if (score < 4) {
            scoreValue.style.color = "var(--score-low)";
            scoreInterpretation.textContent = "Your predicted score indicates that you may need additional attention toward your mental well-being.";
            interpretationBox.classList.add("interp-low");
        } else if (score >= 4 && score <= 6) {
            scoreValue.style.color = "var(--score-medium)";
            scoreInterpretation.textContent = "Your predicted score indicates a moderate mental health level.";
            interpretationBox.classList.add("interp-medium");
        } else {
            scoreValue.style.color = "var(--score-high)";
            scoreInterpretation.textContent = "Your predicted score indicates a relatively positive mental health level.";
            interpretationBox.classList.add("interp-high");
        }

        // Reveal card and scroll
        resultCard.classList.remove("hidden");
        resultCard.scrollIntoView({ behavior: "smooth" });
    }

    // Helper: Show/Hide Error Alert
    function showError(msg) {
        errorMessage.textContent = msg;
        errorAlert.classList.remove("hidden");
        errorAlert.scrollIntoView({ behavior: "smooth" });
    }

    function hideError() {
        errorAlert.classList.add("hidden");
    }
});