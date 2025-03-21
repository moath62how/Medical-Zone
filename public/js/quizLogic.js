import { showToastifyNotification } from "./modules/appHelpers.mjs";

var indexQuestion = 0;

// This is used to get the io if the Question set

const data = JSON.parse(document.querySelector("head").dataset.id);

//The api URL that will be called
// const setAPIUrl = "/api/v1/sets/" + id;

window.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("#q_body");
  const checkbox = document.querySelector("#hideAnswer");
  const question = document.querySelector("#questionText");
  const img = document.querySelector("img");
  const toggelBtn = document.getElementById("show-hide-icon");

  toggelBtn.style.cursor = "pointer";

  toggelBtn.addEventListener("click", () => {
    const answers = document.querySelectorAll(".answer");

    // toggelBtn.classList.toggle("bi-eye");
    // toggelBtn.classList.toggle("bi-eye-slash");

    answers.forEach((e) => e.classList.toggle("hidden"));
  });

  document.title = data.name;
  updateQuestion(0, data.questions);
  const nxtBtn = document.querySelector("#next_btn");
  const bckBtn = document.querySelector("#back_btn");

  nxtBtn.addEventListener("click", () => {
    if (indexQuestion < data.questions.length - 1) {
      indexQuestion++;
      updateQuestion(indexQuestion, data.questions);
    } else if (indexQuestion == data.questions.length - 1) {
      Swal.fire({
        title: "Good job!",
        text: "You have completed the quiz!",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Redo the test",
        cancelButtonText: "Go to homepage",
        allowOutsideClick: false, // Prevent closing by clicking outside
        allowEscapeKey: false, // Prevent closing by pressing Escape
      }).then((result) => {
        if (result.isConfirmed) {
          // Reload the page to redo the test
          location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Redirect to the homepage
          window.location.href = "/";
        }
      });
    }
  });

  bckBtn.addEventListener("click", () => {
    if (indexQuestion != 0) {
      indexQuestion--;
      updateQuestion(indexQuestion, data.questions);
    } else {
      showToastifyNotification(
        "There is no Question before that.",
        10000,
        "failure"
      );
    }
  });
  /**
   *
   * @param {Number} i - index of the question you want to render
   * @param {Array} questions -array of questions to render
   */

  function updateQuestion(i, questions) {
    // Clear previous content
    body.innerHTML = "";

    // Hide image and show loader
    img.style.display = "none";
    loaderContainer.classList.remove("d-none");

    // Load image asynchronously
    if (questions[i].image) {
      img.setAttribute("src", questions[i].image);
      img.onload = function () {
        // Image loaded, show it and hide loader
        img.style.display = "block";
        loaderContainer.classList.add("d-none");
      };
      img.onerror = function () {
        // Handle image loading error

        console.error("Error loading image:", questions[i].image);
        img.style.display = "none";
        loaderContainer.classList.add("d-none");
      };
    } else {
      // No image, hide loader
      img.style.display = "none";
      loaderContainer.classList.add("d-none");
    }

    // Set question text
    question.innerText = questions[i].question;
    if (questions[i].question.length > 30) {
      question.classList.add("fs-5");
    }

    // Add sub-questions and answers
    for (let j = 0; j < questions[i].sub_question.length; j++) {
      const sub_q = document.createElement("span");
      const ans = document.createElement("span");
      ans.classList.add("answer", "hidden");
      sub_q.classList.add("fs-2");
      sub_q.innerText = "- " + questions[i].sub_question[j];
      ans.innerText = "(" + questions[i].c_answer[j] + ")";
      body.appendChild(sub_q);
      body.appendChild(ans);
    }
  }
});
