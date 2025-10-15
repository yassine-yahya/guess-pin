// Global variables
let randomNumber;
let results = [];
let times = 0;
let message;
let checkButton;

document.addEventListener("DOMContentLoaded", function() {
  const welcomeScreen = document.getElementById("welcomeScreen");
  const enterGameBtn = document.getElementById("enterGameBtn");
  const gameContainer = document.getElementById("container");

  // Optional: delay auto-enter (e.g., 3 seconds)
  // setTimeout(() => startGameTransition(), 3000);

  enterGameBtn.addEventListener("click", startGameTransition);

  function startGameTransition() {
    welcomeScreen.style.animation = "fadeOut 1s forwards";
    setTimeout(() => {
      welcomeScreen.style.display = "none";
      gameContainer.style.display = "block";
    }, 1000); // match fade-out duration
  }
});


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

    // Trigger check with Enter key (optional)
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
        if (this.value.length === 4) {
        handleComparaison();
        this.value = "";
    }
    });

    // --- 🔢 Mobile numeric keypad logic ---
    const numButtons = document.querySelectorAll(".num-btn");
    const clearBtn = document.querySelector("#clearBtn");
    const enterBtn = document.querySelector("#enterBtn");

    // Add number when user clicks keypad button
 numButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        if (userInput.value.length < 4) {
            userInput.value += btn.textContent;

            // Manually trigger input event so automatic check works
            const event = new Event("input", { bubbles: true });
            userInput.dispatchEvent(event);
        }
    });
});



    // Delete last digit
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            userInput.value = userInput.value.slice(0, -1);
        });
    }

    // Submit number (same as pressing Enter)
    if (enterBtn) {
        enterBtn.addEventListener("click", () => {
            handleComparaison();
            userInput.value = "";
        });
    }
});

// Generate a 4-digit number with unique digits
function generateRandomNumber() {
    const digits = ['0','1','2','3','4','5','6','7','8','9'];
    let result = '';
    times = 0;


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
    let timesDisplay = document.querySelector("#times");
    if (timesDisplay) timesDisplay.innerHTML = "Attempt: 0 of 5";

    return parseInt(result, 10);
}

function showDialog(message, duration = 3000) {
    const dialog = document.getElementById("dialog");
    const dialogMessage = document.getElementById("dialog-message");
    const closeBtn = document.getElementById("dialog-close");

    dialogMessage.textContent = message;
    dialog.classList.add("show");

    // Auto-hide after duration
    const timer = setTimeout(() => {
        dialog.classList.remove("show");
    }, duration);

    // Close manually
    closeBtn.onclick = () => {
        clearTimeout(timer);
        dialog.classList.remove("show");
    };
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
        return;
    }

    let userInput = document.querySelector("#userInput").value.trim();

    if (!/^\d{4}$/.test(userInput)) {
         showDialog("Please enter exactly 4 digits!");
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
            colors[i] = "greenyellow";
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
        message.innerHTML = `❌ Out of attempts! The number was ${randomNumber}. Press the Button to try again.`;
        checkButton.disabled = true;
    }
}
