const { id } = document.querySelector('body').dataset;

const url = "./api/v1/sets/" + id;

async function getData(u) {
  try {
    const response = await axios.get(u);
    // Check for successful response (status code 200)
    if (response.status !== 200) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const { data } = response;
    return data;
  } catch (error) {
    console.error("Error:", error);
    // Handle the error appropriately (e.g., display an error message, retry)
  }
}

/**
 * Returns an object with the frequencies of each elements in the array
 *@param {string[]} arr - The array that you want to count the elemnts of
 */

function countFrequency(arr) {
  const freq = {};

  arr.forEach((e) => {
    e.tags.forEach((f) => {
      if (Object.keys(freq).includes(f)) {
        freq[f]++;
      } else {
        freq[f] = 1;
      }
    });
  });
  return freq;
}

// Main entery function

(async () => {
  const container = document.querySelector("#Data");
  const containerDiv = document.querySelector("#Data");
  const title = document.querySelector("#testName");

  const response = await getData(url);
  const questionsStats = countFrequency(response.data.questions);
  title.innerText = response.data.name;

  for (const [key, value] of Object.entries(questionsStats)) {
    //!hard coded👇
    if (isNaN(+key) && key != "FOMSCU") {
      const div = document.createElement("div");
      div.innerText = `${value} ${key}  ${
        value > 1 ? "questions" : "question"
      }`;
      div.classList.add("my-1");
      containerDiv.appendChild(div);
    }
  }

  const description = document.createElement("div");
  description.innerText = response.data.description;
  description.classList.add("fw-bolder");
  containerDiv.appendChild(description);
})();

const startBtn = document.querySelector("#start");

// console.log();

startBtn.setAttribute("href", `${window.location.href}/start`);
