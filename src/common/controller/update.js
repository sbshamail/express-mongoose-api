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

exports.updateMany = async ({ req, res, model, status }) => {
  try {
    const data = req.body;
    const { ids, ...updateData } = data;

    IsArray(ids, res);
    const response = await model.updateMany({ _id: { $in: ids } }, updateData, {
      new: true,
    });
    return response;
  } catch (error) {
    console.log(model.modelName, error);
    Response(res, 500, constants.GET_ERROR);
  }
};
