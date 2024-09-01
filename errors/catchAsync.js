/**
 * A higher-order function for handling asynchronous errors in controllers.
 * Wraps a controller function and passes any errors to the next middleware.
 *
 * @function tryCatch
 * @param {Function} controller - The asynchronous controller function to be wrapped.
 * @returns {Function} - A new function that wraps the controller in a try-catch block.
 */
exports.tryCatch = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
};
