// Default quotes with categories
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", category: "Wisdom" }
];

// Restore last selected category filter
let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

// Display quotes
function displayQuotes(filteredQuotes) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  filteredQuotes.forEach(q => {
    const div = document.createElement("div");
    div.classList.add("quote");
    div.innerHTML = `
      <p>"${q.text}"</p>
      <p>- ${q.author}</p>
      <small>Category: ${q.category}</small>
    `;
    quoteDisplay.appendChild(div);
  });
}

// Populate categories in dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Get unique categories
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  // Reset dropdown
  categoryFilter.innerHTML = "";

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === lastSelectedCategory) {
      option.selected = true;
    }
    categoryFilter.appendChild(option);
  });
}

// Filter quotes
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    displayQuotes(quotes);
  } else {
    const filtered = quotes.filter(q => q.category === selectedCategory);
    displayQuotes(filtered);
  }
}

// Add a new quote
function addQuote(event) {
  event.preventDefault();

  const text = document.getElementById("quoteText").value.trim();
  const author = document.getElementById("quoteAuthor").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && author && category) {
    quotes.push({ text, author, category });
    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    filterQuotes();

    document.getElementById("addQuoteForm").reset();
  }
}

// Initialize on page load
window.onload = () => {
  populateCategories();
  filterQuotes();
};
