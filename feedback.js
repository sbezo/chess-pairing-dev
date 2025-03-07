function sendFeedback() {
    const feedbackInput = document.getElementById("feedback").value;

    // Allow only alphanumeric characters, spaces, and basic punctuation
    const sanitizedFeedback = feedbackInput.replace(/[^a-zA-Z0-9 .,!?'"()/-]/g, '').trim();

    if (sanitizedFeedback.length === 0) {
        alert("Please enter a valid feedback message.");
        return;
    }

    fetch("https://your-backend-api.com/feedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: sanitizedFeedback })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to send feedback.");
        }
        return response.json();
    })
    .then(data => {
        alert("Thank you for your feedback!");
        document.getElementById("feedback").value = ""; // Clear input field after successful submission
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while sending feedback.");
    });
}