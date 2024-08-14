// import * as Toastify from "https://cdn.jsdelivr.net/npm/toastify-js";
// import * as axios from "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";

/**
 * Show a Toastify notification with customizable options.
 *
 * @param {string} text - The text content of the notification.
 * @param {number} duration - Duration of the notification in milliseconds.
 * @param {string} type - Type of notification ('success', 'failure', 'info').
 */
export function showToastifyNotification(text, duration = 5000, type) {
  let backgroundColor, textColor;
  switch (type) {
    case "success":
      backgroundColor = "#5cb85c"; // Green for success
      textColor = "text-white";
      break;
    case "failure":
      backgroundColor = "#d9534f"; // Red for failure
      textColor = "text-white";
      break;
    case "info":
      backgroundColor = "#5bc0de"; // Blue for info
      textColor = "text-white";
      break;
    default:
      backgroundColor = "#d9534f"; // Default to red for any unknown type
      textColor = "text-white";
      break;
  }
  Toastify({
    text: text,
    duration: duration,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    style: {
      background: backgroundColor,
    },
    className: `toast-${type} ${textColor}`, // Additional classes for styling
    onClick: function () {}, // Callback after click
  }).showToast();
}

export function calculateOccurrencePercentage(array, targetElement) {
  const count = array.filter((element) => {
    console.log(element, ":", targetElement);
    return element == targetElement;
  }).length;
  const percentage = (count / array.length) * 100;
  console.log(percentage, count);

  return percentage;
}

// Function to copy text to the clipboard using the Clipboard API
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    // Notify the user that the text has been copied
    showToastifyNotification(
      "Copied to clipboard successfully",
      3000,
      "success"
    );
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}

export async function getData(URL) {
  try {
    const response = await axios.get(URL);
    // Check for successful response (status code 200)
    if (response.status !== 200) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error:", error);
    // Handle the error appropriately (e.g., display an error message, retry)
  }
}

export function shuffle(array) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    // t = array[m];
    // array[m] = array[i];
    // array[i] = t;
    //* updated way of swapping elements
    [array[m], array[i]] = [array[i], array[m]];
  }

  return array;
}

export class ModalDialog {
  constructor(
    modalId,
    title,
    bodyContent,
    primaryButtonText,
    primaryButtonAction
  ) {
    // Create modal structure
    this.modalDiv = document.createElement("div");
    this.modalDiv.className = "modal fade";
    this.modalDiv.id = modalId;
    this.modalDiv.tabIndex = -1;
    this.modalDiv.setAttribute("aria-labelledby", `${modalId}Label`);
    this.modalDiv.setAttribute("aria-hidden", "true");

    this.modalDiv.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="${modalId}Label">${title}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${bodyContent}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">${primaryButtonText}</button>
          </div>
        </div>
      </div>
    `;

    // Attach the modal to the body
    document.body.appendChild(this.modalDiv);

    // Add event listener for the primary button if needed
    if (primaryButtonAction) {
      this.modalDiv
        .querySelector(".btn-primary")
        .addEventListener("click", primaryButtonAction);
    }

    // Initialize Bootstrap's modal instance
    this.bootstrapModal = new bootstrap.Modal(this.modalDiv);
  }

  show() {
    // Use Bootstrap's modal API to show the modal
    this.bootstrapModal.show();
  }

  hide() {
    // Use Bootstrap's modal API to hide the modal
    this.bootstrapModal.hide();
  }
}
