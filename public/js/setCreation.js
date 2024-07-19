import {
  showToastifyNotification,
  copyToClipboard,
} from "./modules/appHelpers.mjs";

const setsAPI = "/api/v1/sets/";
const QuestionsAPI = "/api/v1/questions/";

document.addEventListener("DOMContentLoaded", function () {
  var questionCounter = 0;
  var questionType;

  document.getElementById("addQ").addEventListener("click", function () {
    if (document.querySelector('input[name="MCQ_MEQ"]:checked')) {
      questionType = document.querySelector(
        'input[name="MCQ_MEQ"]:checked'
      ).value;
    } else {
      showToastifyNotification(
        "Choose the format of the questions",
        3000,
        "failure"
      );
    }

    if (questionType === "MCQ") {
      //* Handles MCQ question type

      questionCounter++;
      var questionNumber = questionCounter;

      var questionHtml = `
                    <div class="question" id="question${questionNumber}">
                        <h1>Question number ${questionNumber}</h1>
                        <div class="mb-3 w-50">
                            <label for="Q_text_${questionNumber}" class="form-label">Enter the question header :</label>
                            <input id="Q_text_${questionNumber}" class="form-control" type="text" placeholder=" What is the primary organ affected by hepatitis?" aria-label="Default input">
                        </div>
                        <div class="mb-3 w-25">
                            <label for="C_answer_${questionNumber}" class="form-label">Enter the Correct answer :</label>
                            <input id="C_answer_${questionNumber}" class="form-control" type="text" placeholder="Liver" aria-label="Default input">
                        </div>
                        <div class="mb-3 w-100">
                            <legend>Enter the false answers to that question :</legend>
                            <div class="d-flex justify-content-around">
                                <input id="w_answer1_${questionNumber}" class="form-control mr-2 w-25" type="text" placeholder="Heart" aria-label="Answer 1">
                                <input id="w_answer2_${questionNumber}" class="form-control mr-2 w-25" type="text" placeholder="Kidney" aria-label="Answer 2">
                                <input id="w_answer3_${questionNumber}" class="form-control w-25" type="text" placeholder="Lung" aria-label="Answer 3">
                            </div>
                        </div>
                        <div class="mb-3 w-50">
                            <label for="Q_tags_${questionNumber}" class="form-label">Enter the questions' tags (Separate each tag with a comma):</label>
                            <textarea id="Q_tags_${questionNumber}" class="form-control form-control-sm" placeholder="Anatomy,Pharmacology,Pathology,......."></textarea>
                        </div>
                    </div>
                `;

      document
        .getElementById("main")
        .insertAdjacentHTML("beforeend", questionHtml);
    } else if (questionType === "MEQ") {
      //* Handles MEQ question type
      questionCounter++;
      var questionNumber = questionCounter;

      var questionHtml = `
    <div class="question" id="question${questionNumber}">
        <h1>Question number ${questionNumber}</h1>
        <div class="mb-3 w-50">
            <label for="Q_header_${questionNumber}" class="form-label">Enter question header:</label>
            <input type="text" id="Q_header_${questionNumber}" class="form-control form-control-sm" placeholder="Section x">
        </div>
        <div class="mb-3 w-50">
            <label for="Q_subQuestions_${questionNumber}" class="form-label">Enter sub questions (Separate each question with a comma):</label>
            <textarea id="Q_subQuestions_${questionNumber}" class="form-control form-control-sm" placeholder="Mention name of x,Mention one utilization for Y"></textarea>
        </div>
        <div class="mb-3 w-50">
            <label for="Q_subAnswers_${questionNumber}" class="form-label">Enter the sub questions' answers (Separate each answer with a comma):</label>
            <textarea id="Q_subAnswers_${questionNumber}" class="form-control form-control-sm" placeholder="visceral pleura, reflects at the pulmonary hilum"></textarea>
        </div>
        <div class="mb-3 w-50">
            <label for="Q_tags_${questionNumber}" class="form-label">Enter the questions' tags (Separate each tag with a comma):</label>
            <textarea id="Q_tags_${questionNumber}" class="form-control form-control-sm" placeholder="Anatomy,Pharmacology,Pathology,......."></textarea>
        </div>
        <div class="mb-3 w-50">
            <label for="Q_image_${questionNumber}">Image (Optional):</label>
            <input type="file" id="Q_image_${questionNumber}" name="Q_image_${questionNumber}" accept="image/*" class="form-control">
        </div>
    </div>
`;

      document
        .getElementById("main")
        .insertAdjacentHTML("beforeend", questionHtml);

      // alert("MEQ questions are not implemented yet.");
    }
  });

  document.getElementById("removeQ").addEventListener("click", function () {
    if (questionCounter > 0) {
      var lastQuestion = document.getElementById("question" + questionCounter);
      lastQuestion.parentNode.removeChild(lastQuestion);
      questionCounter--;
    }
  });

  document.getElementById("sendData").addEventListener("click", function () {
    var allFieldsFilled = true;
    let questionsWithMistakes = [];
    let questionData = [];
    // Iterate over each question if its MCQ
    if (questionType == "MCQ") {
      for (var i = 1; i <= questionCounter; i++) {
        var Q_text = document.getElementById(`Q_text_${i}`).value.trim();
        var C_answer = document.getElementById(`C_answer_${i}`).value.trim();
        var w_answer1 = document.getElementById(`w_answer1_${i}`).value.trim();
        var w_answer2 = document.getElementById(`w_answer2_${i}`).value.trim();
        var w_answer3 = document.getElementById(`w_answer3_${i}`).value.trim();
        var tags = document.getElementById(`Q_tags_${i}`).value.split(",");
        // Check if any field is empty
        if (
          Q_text === "" ||
          C_answer === "" ||
          w_answer1 === "" ||
          w_answer2 === "" ||
          w_answer3 === ""
        ) {
          allFieldsFilled = false;
          questionsWithMistakes.push(i);
        } else {
          //add it to the array that will be sent to the database
          let obj = {
            question: Q_text,
            c_answer: [C_answer],
            type: "MCQ",
            answers: [w_answer1, w_answer2, w_answer3],
            tags: tags.map((e) => e.trim()),
          };
          questionData.push(obj);
        }
      }
    } else if (questionType == "MEQ") {
      for (let i = 1; i <= questionCounter; i++) {
        var Q_image = document.getElementById(`Q_image_${i}`).value;
        var Q_subAnswers = document
          .getElementById(`Q_subAnswers_${i}`)
          .value.trim();
        var Q_subQuestions = document
          .getElementById(`Q_subQuestions_${i}`)
          .value.trim();
        var Q_header = document.getElementById(`Q_header_${i}`).value.trim();
        var Q_tags = document.getElementById(`Q_tags_${i}`).value.trim();
        if (
          Q_header === "" ||
          Q_tags === "" ||
          Q_subAnswers === "" ||
          Q_subQuestions === ""
        ) {
          allFieldsFilled = false;
          questionsWithMistakes.push(i);
        } else {
          const formData = new FormData();

          Q_subQuestions = Q_subQuestions.split(",");
          Q_subAnswers = Q_subAnswers.split(",");

          if (Q_subAnswers.length !== Q_subQuestions.length) {
            // will work as if an error was thrown
            allFieldsFilled = false;
            questionsWithMistakes.push(i);
            continue;
          }

          const obj = {
            question: Q_header,
            c_answer: Q_subAnswers,
            type: "MEQ",
            sub_question: Q_subQuestions,
            tags: Q_tags.split(",").map((e) => e.trim()),
            Q_image: document.getElementById(`Q_image_${i}`).files[0],
          };

          for (const [key, value] of Object.entries(obj)) {
            formData.set(key, value);
          }

          questionData.push(formData);
        }
      }
    }

    // check if the set's fields is empty
    if (
      document.getElementById("setName").value === "" ||
      document.getElementById("modName").value === "" ||
      document.getElementById("SetTags").value === "" ||
      document.getElementById("inlineFormSelectPref").value ===
        "Choose the set type"
    ) {
      allFieldsFilled = false;
    }

    if (allFieldsFilled && questionCounter != 0) {
      showToastifyNotification(
        "All fields contain data. Sending data...",
        3000,
        "info"
      );

      const obj = {
        name: document.getElementById("setName").value.trim(),
        tags: document.getElementById("SetTags").value.trim().split(","),
        type: document.getElementById("inlineFormSelectPref").value.trim(),
        format: questionType,
        educationalModule: document.getElementById("modName").value.trim(),
      };

      async function createAndUpdateSet(
        obj,
        setsAPI,
        questionData,
        QuestionsAPI
      ) {
        try {
          // Step 1: Create the set
          let res = await createSet(obj, setsAPI);
          let setId = res.data.data._id;

          // Step 2: Add questions to the set
          let questionResponses = await questionsToSet(
            questionData,
            QuestionsAPI
          );
          let questionsId = questionResponses
            .map((val) => {
              if (val.status !== "rejected") {
                return val.value.data.data._id;
              }
            })
            .filter((id) => id !== undefined); // Filter out undefined values if any

          // Step 3: Update the set with question IDs
          await axios.patch(window.location.origin + setsAPI + "/" + setId, {
            questions: questionsId,
          });

          // Step 4: Show success notification
          showToastifyNotification(
            "Set was succesfuly uploaded",
            2000,
            "Success"
          );

          // Step 5: Copy the link to clipboard
          copyToClipboard(window.location.origin + "/" + setId + "/" + "start");
        } catch (err) {
          // Error handling
          showToastifyNotification(
            "Oops something went wrong, contact the admin",
            2000,
            "failure"
          );
        }
      }

      createAndUpdateSet(obj, setsAPI, questionData, QuestionsAPI)
        .then(() => {
          console.log("After async call");
        })
        .catch((err) => {
          console.error("Error during async call:", err);
        });
    } else {
      showToastifyNotification(
        "Please fill in all fields before sending data. There are problems with the questions or the set.",
        5000,
        "info"
      );
    }
  });
});

async function createSet(data, setsAPI) {
  try {
    const res = await axios.post(window.location.origin + setsAPI, data);
    return res;
  } catch (error) {
    // Create a new Popup instance

    showToastifyNotification(
      `There is a problem with the questions or the set. Error: ${error.message}`,
      7000,
      "failure"
    );

    console.error("Error:", error);
  }
}

/**
 * Sends a set of questions to a specified API endpoint.
 *
 * @param {Array<string|FormData>} data - An array of data objects or FormData to be sent.
 * @param {string} QuestionsAPI - The API endpoint to which the questions will be sent.
 * @returns {Promise} A promise that resolves when all POST requests are settled.
 */

async function questionsToSet(data, QuestionsAPI) {
  try {
    let promises = [];
    let headers;

    if (data[0] instanceof FormData) {
      headers = {
        "Content-Type": "multipart/form-data",
      };
    } else {
      headers = {
        "Content-Type": "application/json",
      };
    }

    data.forEach((ele) => {
      const res = axios.post(
        window.location.origin + QuestionsAPI,
        ele,
        headers
      );
      promises.push(res);
    });
    return Promise.allSettled(promises);
  } catch (error) {
    console.error(error);
    showToastifyNotification(
      "An error occurred while submitting the questions.",
      4000,
      "failure"
    );
  }
}
