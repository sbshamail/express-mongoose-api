const { handleError } = require("./errorHandler");
const { Response } = require("./responseHandler");
const mongoose = require("mongoose");

exports.handleAsync = (fn, model, customError, status = 400) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(`error on =====${model}===`, error);
      if (customError) {
        return Response(res, status, customError);
      }
      handleError(res, error);
      next(error);
    }
  };
};

exports.handleAsyncSession = (fn, modelName, customError, status = 400) => {
  return async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await fn(req, res, next, session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.log(`Error in ${modelName}:`, error);
      if (customError) {
        Response(res, status, customError);
      } else {
        Response(res, 500, "An unexpected error occurred");
      }
    } finally {
      session.endSession();
    }
  };
};
