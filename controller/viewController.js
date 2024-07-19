const Set = require("../models/setModel");
const EduMod = require("../models/EduModModel");

/**
 * Extracts all words from a given string.
 *
 * This function uses a regular expression to match and extract all words
 * from the input text. A word is defined as a sequence of one or more
 * word characters (letters, digits, and underscores). The function also
 * supports words that include hyphens and apostrophes.
 *
 * @param {string} text - The input string from which to extract words.
 * @returns {string[]} An array of words extracted from the input string.
 *
 * @example
 * const input = "This is a well-being test with don't and re-enter.";
 * const words = extractWords(input);
 * console.log(words);
 * //Output: ['This', 'is', 'a', 'well-being', 'test', 'with', 'don\'t', 'and', 're-enter']
 */
function extractWords(text) {
  const regex = /[\w'-]+/g;
  return text.match(regex) || [];
}

/**
 * Renders the homepage for the website
 */
exports.getHome = async (req, res, next) => {
  const eduMod = await EduMod.find({}, { name: 1, image: 1 });
  res.render("questionCards", { eduMod });
};

/**
 * Renders a page with buttons for each choice provided in the choices array.
 * If the choices array is empty, it attempts to use the choices stored in req.arr.
 *
 * @param {[String]} choices - An array of choice strings to be rendered as buttons.
 * @returns {Function} Middleware function that handles the request and response.
 *
 * The middleware function performs the following steps:
 * 1. Checks if the choices array is empty. If it is, it assigns `req.arr` to choices.
 * 2. Extracts a title from the request path by capitalizing the first character
 *    and removing the leading and trailing slashes.
 * 3. Calls the `extractWords` function to process the title and uses the last word
 *    as the final title.
 * 4. Renders a view named "choiceBtn" with the provided choices and the final title.
 *
 * Usage:
 *
 * const express = require('express');
 * const app = express();
 * const { getChoice } = require('./path/to/this/file');
 *
 * app.use('/your-path', getChoice(['Choice1', 'Choice2', 'Choice3']));
 *
 * The above usage will render buttons for 'Choice1', 'Choice2', and 'Choice3'
 * at the '/your-path' endpoint.
 *
 * Dependencies:
 * - Assumes there is a view template named "choiceBtn" which can handle the
 *   rendering of the choices and title.
 * - Assumes the presence of an `extractWords` function that processes the title.
 */
exports.getChoice = (initialChoices) => {
  return (req, res, next) => {
    let choices = initialChoices;

    if (!choices || choices.length === 0) {
      choices = req.arr;
    }

    let title = req.path.charAt(0).toUpperCase() + req.path.slice(1);
    title = title.substring(1, title.length - 1);

    const arr = extractWords(title);

    const formattedChoices = choices.map((doc) => ({
      text: doc,
      link: doc,
    }));

    res.render("choiceBtn", {
      choices: formattedChoices,
      title: arr[arr.length - 1],
    });
  };
};

/**
 * Handles the request to display quiz information based on the quiz ID.
 *
 * This asynchronous function extracts the quiz ID from the request parameters
 * and renders the 'quizInfo' view with the extracted ID. It sends a response
 * with status code 200 indicating a successful request. This function is
 * typically used to display detailed information about a specific quiz.
 *
 * @param {Object} req - The request object from the client, which contains
 *                       the request parameters, body, query string, etc.
 * @param {Object} res - The response object that will be sent back to the client.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void} This function does not return any value. It sends a response
 *                 with the rendered 'quizInfo' view.
 *
 * @example
 * // Assuming this function is used as an Express route handler
 * router.get("/:id([a-fA-F0-9]{24})", getQuizInfo);
 *
 * // If a request is made to '/5f8d0d55b54764421b7156c3'
 * // The function will render the 'quizInfo' view with the quiz ID '5f8d0d55b54764421b7156c3'
 */
exports.getQuizInfo = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Set.findById(req.params.id);
    console.log(data.format);
    if (data.format != "MCQ") {
      res.status(200).render("quizInfo", { id, title: data.name });
    } else {
      res.status(200).redirect(id + "/start/");
    }
  } catch (e) {
    console.log(e);
  }
};

exports.typeExists = async (req, res, next) => {
  const data = await Set.findOne({ type: req.params.type });
  if (!data) {
    res.status(404).render("error", {
      status: 404,
      message: 'There is no "' + req.params.type + '" Question sets Available',
    });
  } else {
    return next();
  }
};

/**
 * Handles the request to start a quiz based on the quiz ID.
 *
 * This asynchronous function extracts the quiz ID from the request parameters
 * and renders the 'quiz' view with the extracted ID. It sends a response
 * with status code 200 indicating a successful request. This function is
 * typically used to display the quiz interface for a specific quiz.
 *
 * @param {Object} req - The request object from the client, which contains
 *                       the request parameters, body, query string, etc.
 * @param {Object} res - The response object that will be sent back to the client.
 * @param {Function} next - The next middleware function in the stack.
 *
 * @returns {void} This function does not return any value. It sends a response
 *                 with the rendered 'quiz' view.
 *
 * @example
 * // Assuming this function is used as an Express route handler
 * router.get("/:id([a-fA-F0-9]{24})/start", getQuizStart);
 *
 * // If a request is made to '/5f8d0d55b54764421b7156c3/start'
 * // The function will render the 'quiz' view with the quiz ID '5f8d0d55b54764421b7156c3'
 */
exports.getQuizStart = async (req, res, next) => {
  const { id } = req.params;
  const data = await Set.findById(req.params.id).populate("questions");
  if (data.format != "MCQ")
    res.status(200).render("quiz", { id, title: data.name });
  else
    res
      .status(200)
      .render("mcq", { id: JSON.stringify(data), title: data.name });
};

exports.getLogin = async (req, res, next) => {
  res.status(200).render("login");
};

exports.getDashboard = async (req, res, next) => {
  res.status(200).render("adminDashboard");
};

exports.getCreateSetPage = (req, res, next) => {
  res.status(200).render("createSet");
};

exports.getPrevious = async (req, res, next) => {
  //{ eduMod: 'Renal', faculty: 'FOMSCU' }
  const { eduMod, faculty } = req.params;
  const matches = req.path
    .match(/\/([^\/]*)/g)
    .map((match) => match.replace(/\//g, ""));
  const type = matches[2];
  const tags = [matches[4], matches[3]];
  const format = type === "Labs" ? "MEQ" : "MCQ";
  const data = await Set.find(
    {
      tags: { $all: tags },
      format,
    },
    "_id name"
  );
  const choices = data.map((doc) => ({
    text: doc.name,
    link: doc._id,
  }));
  res.status(200).render("choiceBtn", { choices, title: "Wow" });
};
