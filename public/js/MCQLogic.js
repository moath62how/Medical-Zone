import { shuffle } from "./modules/appHelpers.mjs";

var indexQuestion = 0;
window.addEventListener("DOMContentLoaded", () => {
  const headElement = document.querySelector("head");
  var data = headElement.getAttribute("data-id");
  data = shuffle(JSON.parse(data).questions);
  headElement.setAttribute("data-id", "");

  /**
   * @typedef {'skipped' | 'answered' | 'revealed' | undefined} QuestionStatus
   */

  /**
   * An array representing the status of each question in the quiz.
   * Each element can have one of the following values:
   * - 'skipped': The question was skipped.
   * - 'answered': The question was answered.
   * - 'revealed': The answer to the question that's answerd was revealed.
   * - undefined: The question has not been answered.
   *
   * @type {QuestionStatus[]}
   */

  const questionStatuses = new Array(data.length);

  const nxtBtn = document.querySelector("#next_btn");
  const bckBtn = document.querySelector("#back_btn");

  removeLoaders();
  updateQuestion(0, data);

  nxtBtn.addEventListener("click", () => {
    if (indexQuestion < data.length - 1) {
      indexQuestion++;
      updateQuestion(indexQuestion, data);
      checkStatus();
    } else if (indexQuestion == data.length - 1) {
      //Add what will hapen when the user reaches the end of the question set.
      showToastifyNotification("yes");
    }
  });

  bckBtn.addEventListener("click", () => {
    if (indexQuestion == 0) {
      return showToastifyNotification("There is no Question before that.");
    }
    enableInput(document.querySelectorAll("input[type=radio]"));
    const answers = document.querySelectorAll(".answers");
    answers.forEach((e) => {
      if (data[indexQuestion].c_answer[0] == e.innerText) {
        e.classList.remove("bg-success");
      } else {
        e.classList.remove("bg-danger");
      }
    });
    // checkStatus();
    --indexQuestion;
    updateQuestion(indexQuestion, data);
  });

  const toggelBtn = document.getElementById("show-hide-icon");

  toggelBtn.style.cursor = "pointer";

  toggelBtn.addEventListener("change", (e) => {
    const checkbox = e.target;
    const answers = document.querySelectorAll(".answers");

    checkbox.classList.toggle("bi-eye");
    checkbox.classList.toggle("bi-eye-slash");

    if (checkbox.checked) {
      disableInput(document.querySelectorAll("input[type=radio]"));
      answers.forEach((e) => {
        if (data[indexQuestion].c_answer[0] == e.innerText) {
          e.classList.add("bg-success");
        } else {
          e.classList.add("bg-danger");
        }
      });
    } else {
      enableInput(document.querySelectorAll("input[type=radio]"));
      answers.forEach((e) => {
        if (data[indexQuestion].c_answer[0] == e.innerText) {
          e.classList.remove("bg-success");
        } else {
          e.classList.remove("bg-danger");
        }
      });
    }
  });

  function updateQuestion(i, arr) {
    let q_text = document.getElementById("question");
    let answers = document.querySelectorAll(".answers");
    const counterDiv = document.createElement("div");

    counterDiv.style.position = "relative";
    counterDiv.style.textAlign = "left";

    counterDiv.innerText = `[${i + 1}/${arr.length}]`;

    q_text.innerText = arr[i].question;
    q_text.prepend(counterDiv);

    answers = Array.from(answers);
    answers = shuffle(answers);

    for (let j = 0; j < 3; j++) {
      answers[j].innerText = arr[i].answers[j];
    }
    answers[3].innerText = arr[i].c_answer;
  }

  function removeLoaders() {
    const circle = document.querySelector(".spinner-border");
    const btn = document.querySelectorAll("input[type=radio]");
    enableInput(btn);
    circle.remove();
  }
});
/**
 * Enables input elements by removing the 'disabled' attribute and specific classes from their next siblings.
 *
 * @param {NodeList} btn - A NodeList of elements to enable.
 */
function enableInput(btn) {
  btn.forEach((e) => {
    e.removeAttribute("disabled");
    e.nextSibling.classList.remove("placeholder");
    e.nextSibling.classList.remove("disabled");
  });
}

/**
 * Disables input elements by adding the 'disabled' attribute and specific classes to their next siblings.
 *
 * @param {NodeList} btn - A NodeList of elements to disable.
 * @param {boolean} [fadded=false] - A flag indicating whether to add the 'placeholder' class to the next siblings.
 */
function disableInput(btn, fadded = false) {
  btn.forEach((e) => {
    e.setAttribute("disabled", "true");
    if (fadded) {
      e.nextSibling.classList.add("placeholder");
    }
    e.nextSibling.classList.add("disabled");
  });
}

/**
 * Show a Toastify notification with customizable options.
 *
 * @param {string} text - The text content of the notification.
 * @param {number} duration - Duration of the notification in milliseconds.
 * @param {string} type - Type of notification ('success', 'failure', 'info').
 */
function showToastifyNotification(text, duration = 5000, type) {
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

function checkStatus(data, arr, i) {}
