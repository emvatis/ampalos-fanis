import { generateImageName, generateMarkdownContent } from './utils.js';

// Function to create and download the markdown file
function createMarkdownFile(markdownContent, dateSlug, titleSlug) {
  const blob = new Blob([markdownContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${dateSlug}_${titleSlug}.md`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Function to copy the suggested name to the clipboard
// Make it globally accessible since it's called from dynamically added HTML
window.copyToClipboard = async function() {
  const suggestedNameInput = document.getElementById('suggestedName');
  try {
    await navigator.clipboard.writeText(suggestedNameInput.value);
    alert('Το όνομα αρχείου αντιγράφηκε στο πρόχειρο!');
  } catch (err) {
    alert('Αποτυχία αντιγραφής στο πρόχειρο.');
  }
}

// Function to display a message in the message div
function displayMessage(message, className = '') {
  const messageDiv = document.getElementById('message');
  messageDiv.innerHTML = message;
  messageDiv.className = className;
}

// Function to handle the form submission
function handleFormSubmit(event) {
  event.preventDefault();
  const dateFormatted = document.getElementById('date').value;
  const dateSlug = dateFormatted.replaceAll('-', '');

  const formData = {
    title: document.getElementById('title').value.trim(),
    content: document.getElementById('content').value,
    dateFormatted: dateFormatted,
    dateSlug: dateSlug,
    linkName: document.getElementById('linkName').value,
    linkURL: document.getElementById('linkURL').value,
    tags: document
      .getElementById('tags')
      .value.split(',')
      .map(tag => tag.trim())
      .join(', '),
    image: document.getElementById('image').files[0],
  };

  if (!document.getElementById('createMarkdownForm').checkValidity()) {
    displayMessage('Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία.', 'error');
    return;
  }

  const titleSlug = formData.title.toLowerCase().replace(/ /g, '_');

  let imageName = '';
  let recommendedName = '';
  let imageLink = '';

  if (formData.image) {
    imageName = formData.image.name;
    recommendedName = generateImageName(dateSlug, titleSlug, imageName);
    imageLink = `/articles/images/${recommendedName}`;
  }

  const markdownContent = generateMarkdownContent(
    formData,
    imageName,
    imageLink
  );
  createMarkdownFile(markdownContent, dateSlug, titleSlug);

  let message = 'Το .md αρχείο δημιουργήθηκε. Ελέγξτε τις λήψεις σας.';
  if (formData.image) {
    message += `
      <div class="rename-message">
        <p>Παρακαλώ μετονομάστε την εικόνα σε:</p>
        <input type="text" class="suggested-name" id="suggestedName" value="${recommendedName}" readonly>
        <button type="button" class="copy-button" onclick="copyToClipboard()">Αντιγραφή</button>
      </div>
    `;
  }
  displayMessage(message, 'success');
}

// Event listener for the form submission
document
  .getElementById('createMarkdownForm')
  .addEventListener('submit', handleFormSubmit);

// Event listener for the image selection
document.getElementById('image').addEventListener('change', function () {
  const imageFile = this.files[0];
  const selectedImageElement = document.getElementById('selectedImage');
  selectedImageElement.textContent = imageFile
    ? `Επιλεγμένη εικόνα: ${imageFile.name}`
    : '';
});

