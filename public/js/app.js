var indexQuestion = 0;

async function getData(URL) {
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

const id = document.querySelector("head").dataset.id;

// console.log(document.querySelectorAll("head"));

const URL = "/api/v1/sets/" + id;

window.addEventListener("load", () => {
  const body = document.querySelector("#q_body");
  const checkbox = document.querySelector("#hideAnswer");
  const question = document.querySelector("#questionText");
  console.log(question);
  const img = document.querySelector("img");
  const toggelBtn = document.getElementById("show-hide-icon");
  toggelBtn.style.cursor = "pointer";

  toggelBtn.addEventListener("click", () => {
    const answers = document.querySelectorAll(".answer");

    toggelBtn.classList.toggle("bi-eye");
    toggelBtn.classList.toggle("bi-eye-slash");

    answers.forEach((e) => e.classList.toggle("hidden"));
  });

  (async () => {
    const response = await getData(URL);
    updateQuestion(0, response.data.questions);
    const nxtBtn = document.querySelector("#next_btn");
    const bckBtn = document.querySelector("#back_btn");
    nxtBtn.addEventListener("click", () => {
      indexQuestion++;
      updateQuestion(indexQuestion, response.data.questions);
    });
    bckBtn.addEventListener("click", () => {
      if (indexQuestion != 0) {
        indexQuestion--;
        updateQuestion(indexQuestion, response.data.questions);
      } else {
        window.alert("There is no Question befor that.");
      }
    });
  })();

  /**
   *
   * @param {Number} i - index of the question you want to render
   * @param {Array} questions -array of questions to render
   */

  const updateQuestion = function (i, questions) {
    body.innerHTML = "";
    img.setAttribute("src", questions[i].image);
    question.innerText = questions[i].question;

    for (let j = 0; j < questions[i].sub_question.length; j++) {
      const sub_q = document.createElement("span");
      const ans = document.createElement("span");
      ans.classList.add("answer");
      ans.classList.add("hidden");
      sub_q.classList.add("fs-2");
      sub_q.innerText = "- " + questions[i].sub_question[j];
      ans.innerText = "(" + questions[i].c_answer[j] + ")";
      body.appendChild(sub_q);
      body.appendChild(ans);
    }
  };
});
