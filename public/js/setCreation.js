const setsAPI = "/api/v1/sets/";
const QuestionsAPI = "/api/v1/question/";

document.addEventListener("DOMContentLoaded", function () {
  var questionCounter = 0;
  var questionType;
  document.getElementById("addQ").addEventListener("click", function () {
    questionType = document.querySelector(
      'input[name="MCQ_MEQ"]:checked'
    ).value;
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
    } else {
      alert("Please select a question type.");
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
            answer: [w_answer1, w_answer2, w_answer3],
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

          formData.set(
            "Q_image",
            document.getElementById(`Q_image_${i}`).files[0]
          );
          //! remember to throw and error if they arent equal in size
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
            sub_question: Q_subQuestions,
            tags: Q_tags.split(","),
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
      Toastify({
        text: "All fields contain data. Sending data...",
        duration: 3000, // Duration in milliseconds
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)", // Green color gradient
        onClick: function () {}, // Callback after click
      }).showToast();

      const obj = {
        name: document.getElementById("setName").value,
        tags: document.getElementById("SetTags").value.split(","),
        type: document.getElementById("inlineFormSelectPref").value,
        format: questionType,
        educationalModule: document.getElementById("modName").value,
      };

      let setId;

      createSet(obj, setsAPI).then((res) => {
        setId = res.data.data._id;
      });

      // Add your code here to send the data
    } else {
      Toastify({
        text: "Please fill in all fields before sending data. There are problems with the questions or the set.",
        duration: 5000, // Duration in milliseconds
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "#C80036", // Red background color
        className: "toast-error", // Optional additional class for styling
        onClick: function () {}, // Callback after click
      }).showToast();
    }
  });
});

async function createSet(data, setsAPI) {
  try {
    const res = await axios.post(window.location.origin + setsAPI, data);
    return res;
  } catch (error) {
    // Create a new Popup instance
    Toastify({
      text: `There is a problem with the questions or the set. Error: ${error.message}`,
      duration: 5000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true,
      // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #C80036, #FF0000)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();

    console.error("Error:", error);
  }
}

async function questionsToSet(setId, data, QuestionsAPI) {
  try {
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

    const res = await axios.post(
      window.location.origin + QuestionsAPI,
      ele,
      headers
    );
  } catch (error) {}
}
