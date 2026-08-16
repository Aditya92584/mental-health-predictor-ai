const form = document.querySelector('form'); // Ya document.getElementById('your-form-id')

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Page reload hone se rokta hai

    // 1. Form inputs se data collect karein
    const formData = {
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        country: document.getElementById('country').value,
        academic_level: document.getElementById('academic_level').value,
        most_used_platform: document.getElementById('most_used_platform').value,
        purpose_of_use: document.getElementById('purpose_of_use').value,
        avg_daily_usage_hours: parseFloat(document.getElementById('avg_daily_usage_hours').value),
        daily_unlocks: parseInt(document.getElementById('daily_unlocks').value),
        study_hours: parseFloat(document.getElementById('study_hours').value),
        physical_activity_hours: parseFloat(document.getElementById('physical_activity_hours').value),
        sleep_hours_per_night: parseFloat(document.getElementById('sleep_hours_per_night').value),
        stress_level: document.getElementById('stress_level').value
    };

    try {
        // 2. API Endpoint par POST request bhejain
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const result = await response.json();
        console.log("Prediction Result:", result);

        const score = result.predicted_mental_health_score;

        // 3. UI elements update karein
        document.getElementById('score-value').innerText = score;

        const interpretationBox = document.getElementById('score-interpretation');
        if (score >= 7.5) {
            interpretationBox.innerText = "Your predicted score is High. You seem to be maintaining good well-being!";
        } else if (score >= 5.0) {
            interpretationBox.innerText = "Your predicted score is Moderate. Consider balancing your screen time and daily routines.";
        } else {
            interpretationBox.innerText = "Your predicted score is Low. Taking breaks and managing stress could be helpful.";
        }

        // 4. Result Card se hidden class hatayein aur scroll karein
        const resultCard = document.getElementById('result-card');
        if (resultCard) {
            resultCard.classList.remove('hidden');
            resultCard.scrollIntoView({ behavior: 'smooth' });
        }

    } catch (error) {
        console.error("Error during prediction:", error);
    }
});

// 5. Predict Again Button Handler
const predictAgainBtn = document.getElementById('predict-again-btn');
if (predictAgainBtn) {
    predictAgainBtn.addEventListener('click', () => {
        const resultCard = document.getElementById('result-card');
        if (resultCard) {
            resultCard.classList.add('hidden');
        }
        form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}