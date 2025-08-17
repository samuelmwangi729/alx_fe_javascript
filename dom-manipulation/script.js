// Array of quotes with text + category
let quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Your limitation—it’s only your imagination.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuote");

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    // Clear and build the DOM dynamically
    quoteDisplay.innerHTML = "";

    const quoteText = document.createElement("p");
    quoteText.textContent = `"${quote.text}"`;

    const quoteCategory = document.createElement("span");
    quoteCategory.classList.add("category");
    quoteCategory.textContent = ` — ${quote.category}`;

    quoteText.appendChild(quoteCategory);
    quoteDisplay.appendChild(quoteText);
}

// Function to add a new quote
function addQuote() {
    const newText = document.getElementById("newQuoteText").value.trim();
    const newCategory = document.getElementById("newQuoteCategory").value.trim();

    if (!newText || !newCategory) {
        alert("Please fill in both fields!");
        return;
    }

    // Add to array
    quotes.push({ text: newText, category: newCategory });

    // Update UI dynamically
    const confirmation = document.createElement("p");
    confirmation.style.color = "green";
    confirmation.textContent = `New quote added in '${newCategory}' category!`;
    document.body.appendChild(confirmation);

    // Clear inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);