const setsAPI = "./api/v1/sets/";
const QuestionsAPI = "./api/v1/question/";

document.addEventListener("DOMContentLoaded", function () {
  var questionCounter = 0;

  document.getElementById("addQ").addEventListener("click", function () {
    var questionType = document.querySelector(
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
    }

    // check if the set's fields is empty
    if (
      document.getElementById("#setName").value === "" ||
      document.getElementById("#modName").value === "" ||
      document.getElementById("#SetTags").value === "" ||
      document.getElementById("#inlineFormSelectPref").value == ""
    ) {
      allFieldsFilled = false;
    }
    if (allFieldsFilled && questionCounter != 0) {
      alert("All fields contain data. Sending data...");
      // a call to the back end that will create the questions first then the set
      console.log(questionData);
      // Add your code here to send the data
    } else {
      const myPopup = new Popup({
        id: "err-popup",
        title: "Please fill in all fields before sending data.",
        content: `there is problems with the questions or the set`,
        blur: true,
        css: `
        .popup-header {
            font-weight: bold;
            background-color: #C80036;
        }
          .popup-title{
            font-size: 18pt;
            margin-top: 3vh;
            }
        `,
      });
      myPopup.show();
    }
  });
});
