const id = document.querySelector("head").dataset.id;

const url = "/api/v1/sets/" + id;

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

function shuffle(array) {
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

window.addEventListener("DOMContentLoaded", async () => {
  var data = (await getData(url)).data.questions;
  data = shuffle(data);
  (async () => {
    const nxtBtn = document.querySelector("#next_btn");
    const bckBtn = document.querySelector("#back_btn");
    removeLoaders();
    updateQuestion(0, data);

    nxtBtn.addEventListener("click", () => {
      if (indexQuestion < data.length - 1) {
        indexQuestion++;
        updateQuestion(indexQuestion, data);
      } else if (indexQuestion == data.length - 1) {
        //Add what will hapen when the user reaches the end of the question set.
        console.log("There is no more question");
      }
    });

    bckBtn.addEventListener("click", () => {
      if (indexQuestion != 0) {
        indexQuestion--;
        updateQuestion(indexQuestion, data);
      } else {
        window.alert("There is no Question befor that.");
      }
    });
  })();
  const toggelBtn = document.getElementById("show-hide-icon");

  toggelBtn.style.cursor = "pointer";

  toggelBtn.addEventListener("click", () => {
    const answers = document.querySelectorAll(".answers");

    toggelBtn.classList.toggle("bi-eye");
    toggelBtn.classList.toggle("bi-eye-slash");
    answers.forEach((e) => {
      console.log(data[indexQuestion].c_answer, e.innerText);
      if (data[indexQuestion].c_answer[0] == e.innerText) {
        e.style.backgroundColor = "green";
      } else {
        e.style.backgroundColor = "red";
      }
    });
  });
  function updateQuestion(i, arr) {
    let q_text = document.getElementById("question");
    let answers = document.querySelectorAll(".answers");

    answers = Array.from(answers);
    answers = shuffle(answers);

    q_text.innerText = arr[i].question;

    for (let j = 0; j < 3; j++) {
      answers[j].innerText = arr[i].answers[j];
    }
    answers[3].innerText = arr[i].c_answer;
  }

  function removeLoaders() {
    const circle = document.querySelector(".spinner-border");
    const btn = document.querySelectorAll("input[type=radio]");
    btn.forEach((e) => {
      e.removeAttribute("disabled");
      e.nextSibling.classList.remove("placeholder");
      e.nextSibling.classList.remove("disabled");
    });
    circle.remove();
  }
});
