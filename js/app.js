// Function to remove Greek accents from a string
function removeGreekAccents(str) {
  const greekAccentMap = {
    ά: "α",
    έ: "ε",
    ή: "η",
    ί: "ι",
    ό: "ο",
    ύ: "υ",
    ώ: "ω",
    Ά: "Α",
    Έ: "Ε",
    Ή: "Η",
    Ί: "Ι",
    Ό: "Ο",
    Ύ: "Υ",
    Ώ: "Ω",
    ϊ: "ι",
    ϋ: "υ",
    ΐ: "ι",
    ΰ: "υ",
    Ϊ: "Ι",
    Ϋ: "Υ",
  };

  return str
    .split("")
    .map((char) => greekAccentMap[char] || char)
    .join("");
}

// Function to generate the recommended image name based on date and title
function generateImageName(dateSlug, titleSlug, imageName) {
  const fileExtension = imageName
    .substring(imageName.lastIndexOf("."))
    .toLowerCase();
  return `${dateSlug}_${titleSlug}${fileExtension}`;
}

// Function to generate the markdown content
function generateMarkdownContent(formData, imageName, imageLink) {
  const { title, content, dateFormatted, dateSlug, linkName, linkURL, tags } =
    formData;

  // Remove accents and convert title to uppercase
  const formattedTitle = removeGreekAccents(title).trim().toUpperCase();

  let markdownContent = `---
title: "${formattedTitle}"
aliases: [/articles/${dateSlug}/]
date: ${dateFormatted}
draft: false
---

${content}

[${linkName}](${linkURL})
`;

  if (imageName) {
    markdownContent += `![${tags}](${imageLink})\n\n`;
  }

  return markdownContent;
}

// Function to create and download the markdown file
function createMarkdownFile(markdownContent, dateSlug, titleSlug) {
  const blob = new Blob([markdownContent], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `${dateSlug}_${titleSlug}.md`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Function to display a message in the message div
function displayMessage(message, className = "") {
  const messageDiv = document.getElementById("message");
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  if (className) {
    messageElement.className = className;
  }
  messageDiv.appendChild(messageElement);
}

// Function to copy the suggested name to the clipboard
function copyToClipboard() {
  const suggestedNameInput = document.getElementById("suggestedName");
  suggestedNameInput.select();
  document.execCommand("copy");
  alert("Το όνομα αρχείου αντιγράφηκε στο πρόχειρο!");
}

// Function to handle the form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const dateFormatted = document.getElementById("date").value;
  const dateSlug = dateFormatted.replaceAll("-", "");

  const formData = {
    title: document.getElementById("title").value.trim(),
    content: document.getElementById("content").value,
    dateFormatted: dateFormatted,
    dateSlug: dateSlug,
    linkName: document.getElementById("linkName").value,
    linkURL: document.getElementById("linkURL").value,
    tags: document
      .getElementById("tags")
      .value.split(",")
      .map((tag) => tag.trim())
      .join(", "),
    image: document.getElementById("image").files[0],
  };

  if (!document.getElementById("createMarkdownForm").checkValidity()) {
    displayMessage("Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία.", "error");
    return;
  }

  const titleSlug = formData.title.toLowerCase().replace(/ /g, "_");

  let imageName = "";
  let recommendedName = "";
  let imageLink = "";

  if (formData.image) {
    imageName = formData.image.name;
    recommendedName = generateImageName(dateSlug, titleSlug, imageName);
    imageLink = `/articles/images/${recommendedName}`;

    const renameMessage = `
      <div class="rename-message">
        <p>Παρακαλώ μετονομάστε την εικόνα σε:</p>
        <input type="text" class="suggested-name" id="suggestedName" value="${recommendedName}" readonly>
        <button type="button" class="copy-button" onclick="copyToClipboard()">Αντιγραφή</button>
      </div>
    `;

    const messageDiv = document.getElementById("message");
    messageDiv.innerHTML += renameMessage;
  }

  const markdownContent = generateMarkdownContent(
    formData,
    imageName,
    imageLink
  );
  createMarkdownFile(markdownContent, dateSlug, titleSlug);

  displayMessage(
    "Το .md αρχείο δημιουργήθηκε. Ελέγξτε τις λήψεις σας.",
    "success"
  );
}

// Event listener for the form submission
document
  .getElementById("createMarkdownForm")
  .addEventListener("submit", handleFormSubmit);

// Event listener for the image selection
document.getElementById("image").addEventListener("change", function () {
  const imageFile = this.files[0];
  const selectedImageElement = document.getElementById("selectedImage");
  selectedImageElement.textContent = imageFile
    ? `Επιλεγμένη εικόνα: ${imageFile.name}`
    : "";
});
