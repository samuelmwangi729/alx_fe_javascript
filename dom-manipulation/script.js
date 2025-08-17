let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
let currentQuote = null;
const apiURL = "https://jsonplaceholder.typicode.com/posts"; // Fake API for simulation

// Fetch a random quote
function getNewQuote() {
  if (localQuotes.length === 0) {
    document.getElementById("quote").innerText = "No quotes available. Please sync.";
    document.getElementById("author").innerText = "";
    return;
  }
  const randomIndex = Math.floor(Math.random() * localQuotes.length);
  currentQuote = localQuotes[randomIndex];
  document.getElementById("quote").innerText = `"${currentQuote.text}"`;
  document.getElementById("author").innerText = `- ${currentQuote.author}`;
}

// Sync with the server
async function syncWithServer() {
  try {
    // Fetch server data
    const response = await fetch(apiURL);
    const serverData = await response.json();

    // Simulate server returning quotes
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      author: "Server"
    }));

    // Conflict resolution: server data overwrites local data
    localQuotes = [...serverQuotes];
    localStorage.setItem("quotes", JSON.stringify(localQuotes));

    showNotification("Data synced with server. Server data replaced local data.");
    getNewQuote();
  } catch (error) {
    console.error("Sync failed:", error);
    showNotification("Error syncing with server. Please try again.");
  }
}

// Show notification to user
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 4000);
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  if (localQuotes.length === 0) {
    syncWithServer();
  } else {
    getNewQuote();
  }
});
