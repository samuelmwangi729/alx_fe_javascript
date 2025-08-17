// script.js
// Dynamic Quote Generator — Local & Session storage + JSON import/export

const LOCAL_STORAGE_KEY = 'quotes';
const SESSION_LAST_KEY = 'lastViewedQuoteIndex';

let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Your limitation—it’s only your imagination.", category: "Inspiration" }
];

function saveQuotes() {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Basic validation: keep objects with text & category strings
        const valid = parsed.filter(q => q && typeof q.text === 'string' && typeof q.category === 'string');
        if (valid.length) quotes = valid;
      }
    }
  } catch (err) {
    console.warn('Error parsing stored quotes. Using defaults.', err);
  }
}

/* Display a random quote and store its index to sessionStorage */
function showRandomQuote() {
  if (!quotes.length) {
    document.getElementById('quoteDisplay').textContent = 'No quotes available.';
    return;
  }
  const idx = Math.floor(Math.random() * quotes.length);
  const q = quotes[idx];

  // Build DOM nodes
  const display = document.getElementById('quoteDisplay');
  display.innerHTML = ''; // clear

  const p = document.createElement('p');
  p.textContent = `"${q.text}"`;

  const span = document.createElement('span');
  span.className = 'category';
  span.textContent = `— ${q.category}`;

  p.appendChild(span);
  display.appendChild(p);

  // Save the index in session storage (demo of sessionStorage)
  sessionStorage.setItem(SESSION_LAST_KEY, String(idx));
  updateLastViewedUI();
}

function updateLastViewedUI() {
  const lastDiv = document.getElementById('lastViewed');
  const raw = sessionStorage.getItem(SESSION_LAST_KEY);
  if (raw !== null && quotes.length) {
    const idx = Number(raw);
    if (!Number.isNaN(idx) && quotes[idx]) {
      lastDiv.textContent = `Last viewed quote (this session): "${quotes[idx].text}" — ${quotes[idx].category}`;
      return;
    }
  }
  lastDiv.textContent = '';
}

/* Add a new quote (called from the dynamic form) */
function addQuote(text, category) {
  const t = (text || '').trim();
  const c = (category || '').trim();
  if (!t || !c) {
    alert('Please enter both quote text and category.');
    return false;
  }

  quotes.push({ text: t, category: c });
  saveQuotes();

  // show confirmation message
  const container = document.getElementById('form-container');
  const msg = document.createElement('div');
  msg.className = 'msg';
  msg.textContent = `New quote added in '${c}' category!`;
  container.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);

  return true;
}

/* Dynamically create Add Quote form and attach handlers */
function createAddQuoteForm() {
  const container = document.getElementById('form-container');
  container.innerHTML = ''; // wipe

  const form = document.createElement('form');
  form.id = 'add-quote-form';

  const textInp = document.createElement('input');
  textInp.type = 'text';
  textInp.id = 'newQuoteText';
  textInp.placeholder = 'Enter a new quote';
  textInp.required = true;

  const catInp = document.createElement('input');
  catInp.type = 'text';
  catInp.id = 'newQuoteCategory';
  catInp.placeholder = 'Enter quote category';
  catInp.required = true;

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Add Quote';

  form.appendChild(textInp);
  form.appendChild(catInp);
  form.appendChild(submitBtn);
  container.appendChild(form);

  // Handle submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const ok = addQuote(textInp.value, catInp.value);
    if (ok) {
      textInp.value = '';
      catInp.value = '';
    }
  });
}

/* Export quotes to JSON file (downloads quotes.json) */
function exportQuotes() {
  try {
    const data = JSON.stringify(quotes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert('Failed to export quotes: ' + err);
  }
}

/* Import quotes from a JSON file (called from file input change) */
function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (ev) {
    try {
      const parsed = JSON.parse(ev.target.result);
      if (!Array.isArray(parsed)) throw new Error('JSON must be an array of quote objects');

      // Validate and keep only objects with text & category strings
      const valid = parsed.filter(q => q && typeof q.text === 'string' && typeof q.category === 'string');
      if (!valid.length) {
        alert('No valid quotes found in the file.');
        return;
      }

      // Merge and persist
      quotes.push(...valid);
      saveQuotes();
      alert(`Imported ${valid.length} quotes successfully!`);
    } catch (err) {
      alert('Failed to import JSON: ' + err.message);
    } finally {
      // Clear the input so the same file can be uploaded again if needed
      event.target.value = '';
    }
  };

  reader.onerror = function () {
    alert('Error reading file.');
    event.target.value = '';
  };

  reader.readAsText(file);
}

/* Init */
document.addEventListener('DOMContentLoaded', () => {
  // Load persisted quotes from localStorage (if any)
  loadQuotes();

  // Create form dynamically
  createAddQuoteForm();

  // Wire up buttons
  const newQBtn = document.getElementById('newQuote');
  newQBtn.addEventListener('click', showRandomQuote);

  const exportBtn = document.getElementById('exportQuotes');
  exportBtn.addEventListener('click', exportQuotes);

  const importInput = document.getElementById('importFile');
  importInput.addEventListener('change', importFromJsonFile);

  // Update last viewed info (sessionStorage)
  updateLastViewedUI();
});
