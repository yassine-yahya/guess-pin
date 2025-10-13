// Global variables
let randomNumber;
let results = [];
let times = 0;
let message;

document.addEventListener("DOMContentLoaded", function() {
    // Select result elements once
    results = [
        document.querySelector("#result1"),
        document.querySelector("#result2"),
        document.querySelector("#result3"),
        document.querySelector("#result4")
    ];

    checkButton = document.querySelector("#checkButton");
    message = document.querySelector("#message");
    const userInput = document.querySelector("#userInput");

    // Initialize display
    resetResults();

    // Generate first random number
    randomNumber = generateRandomNumber();
    console.log("Random number:", randomNumber);

    // Trigger check with Enter key
    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleComparaison();
            userInput.value = "";
        }
    });

    // Restrict input to numbers only (live)
    userInput.addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9]/g, ""); // remove non-numeric chars
    });
});

// Generate a 4-digit number with unique digits
function generateRandomNumber() {
    const digits = ['0','1','2','3','4','5','6','7','8','9'];
    let result = '';

    // First digit: can't be 0
    let firstIndex = Math.floor(Math.random() * 9) + 1; // 1-9
    result += digits[firstIndex];
    digits.splice(firstIndex, 1);

    // Next 3 digits
    for (let i = 0; i < 3; i++) {
        let index = Math.floor(Math.random() * digits.length);
        result += digits[index];
        digits.splice(index, 1);
    }

    resetResults();
    document.querySelector("#userInput").value = "";
    times = 0;
    message.innerHTML = "";

    return parseInt(result, 10);
}

// Reset the displayed digits
function resetResults() {
    results.forEach(result => {
        result.innerHTML = "_";
        result.style.color = "black";
    });
}

// Compare user input with random number
function handleComparaison() {
    if (times >= 5) {
        checkButton.disabled = true;
        message.innerHTML = "❌ You have no more attempts! Click 'Start' to try again.";
        return;
    }

    let userInput = document.querySelector("#userInput").value.trim();

    if (!/^\d{4}$/.test(userInput)) {
        alert("Please enter exactly 4 digits (numbers only)");
        return;
    }

    times++;
    let timesDisplay = document.querySelector("#times");
    if (timesDisplay) timesDisplay.innerHTML = `Attempt: ${times} of 5`;

    const userArray = userInput.split("");
    const randomArray = randomNumber.toString().split("");

    // Count digits in random number
    let counts = {};
    randomArray.forEach(d => counts[d] = (counts[d] || 0) + 1);

    // First pass: mark exact matches (green)
    let colors = Array(4).fill("red");
    for (let i = 0; i < 4; i++) {
        if (userArray[i] === randomArray[i]) {
            colors[i] = "green";
            counts[userArray[i]]--;
        }
    }

    // Second pass: mark correct digits in wrong position (blue)
    for (let i = 0; i < 4; i++) {
        if (colors[i] === "red" && counts[userArray[i]] > 0) {
            colors[i] = "blue";
            counts[userArray[i]]--;
        }
    }

    // Update the UI
    for (let i = 0; i < 4; i++) {
        results[i].innerHTML = userArray[i];
        results[i].style.color = colors[i];
    }

    // Success or failure messages
    if (userInput === randomNumber.toString()) {
        message.innerHTML = "🎉 Correct! You guessed the PIN!";
        checkButton.disabled = true;
    } else if (times === 5) {
        message.innerHTML = `❌ Out of attempts! The number was ${randomNumber}. Press Start to try again.`;
        checkButton.disabled = true;
    }
}
