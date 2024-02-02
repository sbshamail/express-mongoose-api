const mongoose = require("mongoose");
const { removeUndefined, IsArray } = require("../helpers/reuseFunctions");
const { Response } = require("../helpers/responseHandler");
const constants = require("../helpers/constants");

exports.updateApi = async (model, id, data) => {
  removeUndefined(data);
  const response = await model.findByIdAndUpdate({ _id: id }, data, {
    new: true,
  });

  return response;
};

exports.updateManyRecords = async ({
  model,
  ids,
  condition,
  value,
  session,
}) => {
  return await model.updateMany(
    { _id: { $in: ids } },
    { [condition]: value },
    { session }
  );
};

/**
 * @param {Object} args
 * @param {import('express').Request} args.req
 * @param {import('express').Response} args.res
 * @param {import('mongoose').Model} args.model
 */
exports.updateManyByIds = async ({ req, res }) => {
  try {
    const { data, modelName } = req.body;
    const model = mongoose.model(modelName);
    const { ids, ...updateData } = data;
    if (!updateData) {
      return Response(res, 400, "No data Found For Update");
    }
    IsArray(ids, res);
    const response = await model.updateMany({ _id: { $in: ids } }, updateData, {
      new: true,
    });
    if (response) {
      return Response(res, 200, "Deleted Successfully");
    }
  } catch (error) {
    console.log(model.modelName, error);
    Response(res, 400, constants.GET_ERROR);
  }
};

exports.updateFieldAll = async (req, res) => {
  const { name } = req.body;
  const model = mongoose.model(name);
  await model.updateMany({}, { $set: { deleted: false } });
  res.status(200).send(`${name} Documents updated successfully.`);
};
