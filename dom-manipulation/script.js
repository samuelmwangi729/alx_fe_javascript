// Local storage key
const STORAGE_KEY = "quotes";

// UI elements
const quoteText = document.getElementById("quote-text");
const quoteAuthor = document.getElementById("quote-author");
const newQuoteBtn = document.getElementById("new-quote");
const addQuoteForm = document.getElementById("add-quote-form");
const notifications = document.getElementById("notifications");

// ✅ Step 1: Simulate Server Interaction
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API

// Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    // Simulate server having quotes
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      author: `User ${item.userId}`
    }));

    syncWithServer(serverQuotes);
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Post a new quote to server
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quote),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
  } catch (error) {
    console.error("Error posting quote:", error);
  }
}

// ✅ Step 2: Implement Data Syncing
function getLocalQuotes() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveLocalQuotes(quotes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

// Sync local with server (server wins if conflict)
function syncWithServer(serverQuotes) {
  let localQuotes = getLocalQuotes();

  // Simple conflict resolution → server data takes precedence
  serverQuotes.forEach(serverQuote => {
    const exists = localQuotes.find(
      q => q.text === serverQuote.text && q.author === serverQuote.author
    );
    if (!exists) {
      localQuotes.push(serverQuote);
      showNotification("New quotes synced from server.");
    }
  });

  saveLocalQuotes(localQuotes);
}

// ✅ Step 3: Conflict Resolution UI
function showNotification(message) {
  const note = document.createElement("p");
  note.textContent = message;
  note.className = "notification";
  notifications.appendChild(note);

  setTimeout(() => {
    notifications.removeChild(note);
  }, 4000);
}

// ✅ Step 4: Quote Display
function displayRandomQuote() {
  const quotes = getLocalQuotes();
  if (quotes.length === 0) {
    quoteText.textContent = "No quotes available.";
    quoteAuthor.textContent = "";
    return;
  }
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quoteText.textContent = random.text;
  quoteAuthor.textContent = `- ${random.author}`;
}

// Event listeners
newQuoteBtn.addEventListener("click", displayRandomQuote);

addQuoteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = document.getElementById("quote-input").value.trim();
  const author = document.getElementById("author-input").value.trim();

  if (!text || !author) return;

  const newQuote = { text, author };
  let quotes = getLocalQuotes();
  quotes.push(newQuote);
  saveLocalQuotes(quotes);

  // Sync to server
  await postQuoteToServer(newQuote);
  showNotification("New quote added and synced with server.");

  addQuoteForm.reset();
});

// Periodic server sync every 15s
setInterval(fetchQuotesFromServer, 15000);

// Initial load
fetchQuotesFromServer();
displayRandomQuote();
