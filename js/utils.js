/**
 * Removes Greek accents from a string.
 *
 * @param {string} str The input string.
 * @returns {string} The string with Greek accents removed.
 */
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

/**
 * Generates the recommended image name based on date and title.
 *
 * @param {string} dateSlug The date slug.
 * @param {string} titleSlug The title slug.
 * @param {string} imageName The image name.
 * @returns {string} The generated image name.
 */
function generateImageName(dateSlug, titleSlug, imageName) {
  const fileExtension = imageName
    .substring(imageName.lastIndexOf("."))
    .toLowerCase();
  return `${dateSlug}_${titleSlug}${fileExtension}`;
}

/**
 * Generates the markdown content.
 *
 * @param {object} formData The form data.
 * @param {string} imageName The image name.
 * @param {string} imageLink The image link.
 * @returns {string} The generated markdown content.
 */
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

export { removeGreekAccents, generateImageName, generateMarkdownContent };
