// Function to create and append the Add Quote form
function createAddQuoteForm() {
    const formContainer = document.getElementById("form-container");
    if (!formContainer) {
        console.error("No container found with id 'form-container'");
        return;
    }

    // Clear any existing form
    formContainer.innerHTML = "";

    // Create form element
    const form = document.createElement("form");
    form.id = "add-quote-form";

    // Quote text input
    const quoteLabel = document.createElement("label");
    quoteLabel.innerText = "Quote:";
    const quoteInput = document.createElement("input");
    quoteInput.type = "text";
    quoteInput.name = "quote";
    quoteInput.required = true;

    // Author input
    const authorLabel = document.createElement("label");
    authorLabel.innerText = "Author:";
    const authorInput = document.createElement("input");
    authorInput.type = "text";
    authorInput.name = "author";
    authorInput.required = true;

    // Submit button
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.innerText = "Add Quote";

    // Append elements to form
    form.appendChild(quoteLabel);
    form.appendChild(quoteInput);
    form.appendChild(document.createElement("br"));
    form.appendChild(authorLabel);
    form.appendChild(authorInput);
    form.appendChild(document.createElement("br"));
    form.appendChild(submitButton);

    // Append form to container
    formContainer.appendChild(form);

    // Handle form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const newQuote = {
            quote: quoteInput.value,
            author: authorInput.value,
        };

        console.log("New Quote Added:", newQuote);
        alert("Quote added successfully!");
        form.reset();
    });
}

// Example: automatically create form on page load
document.addEventListener("DOMContentLoaded", () => {
    createAddQuoteForm();
});
