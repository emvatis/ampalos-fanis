document.getElementById('image').addEventListener('change', function () {
    const imageFile = this.files[0];
    if (imageFile) {
        const imageName = imageFile.name;
        document.getElementById('selectedImage').textContent = `Επιλεγμένη εικόνα: ${imageName}`;
    }
});

function removeGreekAccents(str) {
    const greekMap = {
        'ά': 'α', 'έ': 'ε', 'ή': 'η', 'ί': 'ι', 'ό': 'ο', 'ύ': 'υ', 'ώ': 'ω',
        'Ά': 'Α', 'Έ': 'Ε', 'Ή': 'Η', 'Ί': 'Ι', 'Ό': 'Ο', 'Ύ': 'Υ', 'Ώ': 'Ω',
        'ϊ': 'ι', 'ϋ': 'υ', 'ΐ': 'ι', 'ΰ': 'υ', // Including dialytika
        'Ϊ': 'Ι', 'Ϋ': 'Υ'
    };

    return str.split('').map(function (char) {
        return greekMap[char] || char;
    }).join('');
}

document.getElementById('createMarkdown').addEventListener('click', function () {
    const titleElement = document.getElementById('title');
    const contentElement = document.getElementById('content');
    const dateElement = document.getElementById('date');
    const linkNameElement = document.getElementById('linkName');
    const linkURLElement = document.getElementById('linkURL');
    const imageElement = document.getElementById('image');
    const tagsElement = document.getElementById('tags');

    const title = titleElement.value.trim().toLowerCase().replace(/ /g, "_");
    const content = contentElement.value;
    const date = dateElement.value.replaceAll('-', '');
    const linkName = linkNameElement.value;
    const linkURL = linkURLElement.value;
    const tags = tagsElement.value.split(',').map(tag => tag.trim()).join(', ');
    const image = imageElement.files[0];

    // Check if every required field passes validity checks
    const allFieldsValid = titleElement.checkValidity() && contentElement.checkValidity() &&
        dateElement.checkValidity() && linkNameElement.checkValidity() &&
        linkURLElement.checkValidity() && imageElement.files.length > 0;

    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = ''; // Clear any previous messages
    messageDiv.style.display = 'block'; // Ensure the message div is visible

    if (!allFieldsValid) {
        const validationMessage = document.createElement('div');
        validationMessage.textContent = "Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία.";
        validationMessage.className = 'flashing'; // Reuse the 'flashing' class for consistency
        messageDiv.appendChild(validationMessage);
        return; // Stop the function if any required field is invalid
    }

    let imageName = '';
    let recommendedName = '';
    let imageLink = '';

    if (image) {
        imageName = image.name;
        let fileExtension = imageName.substring(imageName.lastIndexOf('.')).toLowerCase(); // Ensuring lowercase extension
        recommendedName = `${date}_${title}${fileExtension}`;
        imageLink = `/articles/images/${recommendedName}`; // Constructing image link
    }

    const titleNoAccents = removeGreekAccents(titleElement.value).trim().toUpperCase();

    let markdownContent = `---
title: "${titleNoAccents}"
aliases: [/articles/${date}/]
date: ${dateElement.value}
tags: ${tags}
draft: false
---

${content}

[${linkName}](${linkURL})
`;

    if (imageName) {
        markdownContent += `![${tags}](${imageLink})\n\n`; // Including the image with tags as the alt text
    }

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${date}_${title}.md`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Completion message
    const completionMessage = document.createElement('div');
    completionMessage.textContent = 'Το .md αρχείο δημιουργήθηκε. Ελέγξτε τις λήψεις σας.';
    completionMessage.style.marginBottom = '10px'; // Adds space below the completion message
    messageDiv.appendChild(completionMessage);

    if (image) {
        // Flashing rename message with class for styling
        const renameMessage = document.createElement('div');
        renameMessage.className = 'flashing';
        renameMessage.innerHTML = `Παρακαλώ μετονομάστε την εικόνα σε: <input id="suggestedName" style="width:100%;" value="${recommendedName}" onclick="this.select();">`;
        messageDiv.appendChild(renameMessage);
    }
});
