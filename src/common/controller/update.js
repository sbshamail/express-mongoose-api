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
exports.updateManyByIds = async ({ req, res, model }) => {
  try {
    const data = req.body;
    const { ids, ...updateData } = data;
    if (!updateData) {
      return Response(res, 400, "No data Found For Update");
    }
    IsArray(ids, res);
    const response = await model.updateMany({ _id: { $in: ids } }, updateData, {
      new: true,
    });
    return response;
  } catch (error) {
    console.log(model.modelName, error);
    Response(res, 400, constants.GET_ERROR);
  }
};

exports.updateAddNewField = async ({model, data}) => {
  try {
    await model.updateMany({}, { $set: data }, { new: true });
    console.log(`${model} documents updated successfully.`);
    return Response(res, 400, "Existing documents updated successfully.");
  } catch (error) {
    console.error(`${model} Error updating existing documents:`, error);
    return Response(res, 400, "Error updating existing documents:");
  }
};
