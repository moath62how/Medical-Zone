import {
  shuffle,
  showToastifyNotification,
  ModalDialog,
  calculateOccurrencePercentage,
} from "./modules/appHelpers.mjs";

var indexQuestion = 0;
window.addEventListener("DOMContentLoaded", () => {
  const headElement = document.querySelector("head");
  var data = headElement.getAttribute("data-id");
  data = shuffle(JSON.parse(data).questions);
  headElement.setAttribute("data-id", "");

  /**
   * @typedef {'unanswered' | 'revealed' | string } questionStatuses
   *
   * Represents the status of a question in the quiz.
   * Each element in the array can have one of the following values:
   * - 'unanswered': The question has not been answered.
   * - 'revealed': The answer to the question was revealed.
   * - any string: Represents an answered question with a specific answer.
   *
   * @type {questionStatuses[]}
   */
  const questionStatuses = new Array(data.length).fill("unanswered");

  const nxtBtn = document.querySelector("#next_btn");
  const bckBtn = document.querySelector("#back_btn");
  const toggelBtn = document.getElementById("show-hide-icon");

  removeLoaders();
  updateQuestion(0, data);

  nxtBtn.addEventListener("click", () => {
    //Check what answer was selected
    document.querySelectorAll(`[name="Answer"]`).forEach((e) => {
      if (e.checked && questionStatuses[indexQuestion] != "revealed")
        questionStatuses[indexQuestion] = e.nextSibling.innerText;
      e.checked = false;
    });

    if (indexQuestion < data.length - 1) {
      indexQuestion++;
      updateQuestion(indexQuestion, data);

      toggelBtn.checked = false;
      fireEvent(toggelBtn, "change");

      checkQuestionStatus(questionStatuses, indexQuestion, toggelBtn);
    } else if (indexQuestion == data.length - 1) {
      console.log(questionStatuses);

      const percentageOfUnanswerd = calculateOccurrencePercentage(
        questionStatuses,
        "unanswered"
      );
      const percentageOfRevealed = calculateOccurrencePercentage(
        questionStatuses,
        "revealed"
      );
      const percentageOfAnswerd =
        100 - (percentageOfUnanswerd + percentageOfRevealed);

      const percentageOfAnswerdCorrectly =
        (questionStatuses.filter((e, i) => {
          return e == data[i].c_answer;
        }).length /
          questionStatuses.length) *
        100;
      const percentageOfAnswerdWrong =
        percentageOfAnswerd - percentageOfAnswerdCorrectly;

      const progressBar = `<div class="progress-stacked" style="max-width: 90%;height:fit-content;">
            <div data-bs-toggle="tooltip" data-bs-title="Unanswerd"  class="progress-bar fs-6"
                style="min-width: ${percentageOfUnanswerd}%"> ${percentageOfUnanswerd.toFixed(1)}%
            </div>
            <div data-bs-toggle="tooltip"  data-bs-title="Correct" class="progress-bar bg-success fs-6"
                style="min-width: ${percentageOfAnswerdCorrectly}%"> ${percentageOfAnswerdCorrectly.toFixed(1)}%
            </div>
            <div  data-bs-toggle="tooltip" data-bs-title="Wrong" class="progress-bar bg-danger 
                progress-bar-stripped fs-6" style="min-width: ${percentageOfAnswerdWrong}%"> ${percentageOfAnswerdWrong.toFixed(1)}%
            </div>
            <div data-bs-toggle="tooltip" data-bs-title="Revealed" class="progress-bar bg-warning 
                progress-bar-stripped fs-6" style="min-width: ${percentageOfRevealed}%">${percentageOfRevealed.toFixed(1)}%
            </div>
        </div>`;
      const content = questionStatuses
        .map((e, i) => {
          return `<p text-center>Q${i + 1}:${data[i].question} <br> Your answer was : ${e} ${
            e == data[i].c_answer
              ? `<i class="bi bi-check text-success fs-3"></i>`
              : `<i class="bi bi-x text-danger fs-3"></i>
`
          }  <br>the correct answer is : ${data[i].c_answer}  <p>`;
        })
        .join("");

      const modal = new ModalDialog(
        "modalDialog", // Modal ID
        "Congratulation 🎊", // Title
        progressBar + content, // Body content (HTML string)
        "Finished and go back home ", // Primary button text
        () => {
          // Primary button action
          window.location.href = "/";
        }
      );

      modal.show();

      var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  });

  bckBtn.addEventListener("click", () => {
    if (indexQuestion == 0) {
      return showToastifyNotification("There is no questions before that.");
    }
    enableInput(document.querySelectorAll("input[type=radio]"));

    toggelBtn.checked = false;
    fireEvent(toggelBtn, "change");

    --indexQuestion;
    updateQuestion(indexQuestion, data);
    checkQuestionStatus(questionStatuses, indexQuestion, toggelBtn);
  });

  toggelBtn.style.cursor = "pointer";

  toggelBtn.addEventListener("change", (e) => {
    const checkbox = e.target;
    const answers = document.querySelectorAll(".answers");

    checkbox.classList.toggle("bi-eye");
    checkbox.classList.toggle("bi-eye-slash");

    if (checkbox.checked) {
      questionStatuses[indexQuestion] = "revealed";
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
        e.classList.remove("bg-success");
        e.classList.remove("bg-danger");
      });
    }
  });

  function updateQuestion(i, arr) {
    let q_text = document.getElementById("question");
    let answersdiv = document.querySelectorAll(".answers");
    const counterDiv = document.createElement("div");

    counterDiv.style.position = "relative";
    counterDiv.style.textAlign = "left";

    counterDiv.innerText = `[${i + 1}/${arr.length}]`;

    q_text.innerText = arr[i].question;
    q_text.prepend(counterDiv);

    const answers = shuffle([...arr[i].answers, ...arr[i].c_answer]);

    // answers = shuffle(answers);

    for (let j = 0; j < 4; j++) {
      answersdiv[j].innerText = answers[j];
    }
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

function checkQuestionStatus(
  QuestionsStatusArray,
  questionIndex,
  showHideanswersBtn
) {
  switch (QuestionsStatusArray[questionIndex]) {
    case "revealed":
      showHideanswersBtn.checked = true;
      fireEvent(showHideanswersBtn, "change");
      break;
    case "unanswerd":
      break;
    default:
      document.querySelectorAll(`[name="Answer"]`).forEach((ele) => {
        if (ele.nextSibling.innerText == QuestionsStatusArray[questionIndex])
          ele.checked = true;
      });
      break;
  }
}

function fireEvent(element, eventName) {
  const event = new Event(eventName, { bubbles: true });
  element.dispatchEvent(event);
}
