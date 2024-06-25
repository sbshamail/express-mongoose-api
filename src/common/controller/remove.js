const { Response } = require('../helpers/responseHandler');
const constants = require('../helpers/constants');
const mongoose = require('mongoose');

exports.removeMany = async (req, res, model) => {
  const ids = req.body.ids;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return Response(res, 400, 'Not Found Ids');
  }
  try {
    await model.deleteMany({ _id: { $in: ids } });
    Response(res, 200, constants.DELETE_SUCCESS);
  } catch (error) {
    console.log(model.modelName, error);
    Response(res, 500, constants.GET_ERROR);
  }
};

exports.removedMany = modelName => {
  const model = mongoose.model(modelName);
  return async (req, res) => {
    const ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return Response(res, 400, 'Not Found Ids');
    }
    try {
      await model.deleteMany({ _id: { $in: ids } });
      Response(res, 200, constants.DELETE_SUCCESS);
    } catch (error) {
      console.log(model.modelName, error);
      Response(res, 500, constants.GET_ERROR);
    }
  };
};
exports.removedStatus = (status, modelName) => {
  const model = mongoose.model(modelName);
  return async (req, res, next) => {
    const ids = req.body.ids;
    try {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return Response(res, 400, 'Not Found Ids');
      }
      await model.updateMany({ _id: { $in: ids } }, { deleted: status }, { session });
      Response(res, 200, constants.DELETE_SUCCESS, []);
    } catch (error) {
      console.log(model.modelName, error);
      Response(res, 400, constants.GET_ERROR);
    }
  };
};

exports.removedStatusNext = async ({ req, status, model, session = {} }) => {
  const ids = req.body.ids;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new Error('Not Found Ids');
  }
  await model.updateMany({ _id: { $in: ids } }, { deleted: status }, { session });
};
exports.removedManyNext = async ({ req, model, session = {} }) => {
  const ids = req.body.ids;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new Error('Not Found Ids');
  }
  await model.deleteMany({ _id: { $in: ids } }, { session });
};
