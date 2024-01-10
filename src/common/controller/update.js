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

exports.softRemoveShowStatus = async ({ req, res, model, status }) => {
  try {
    const ids = req.body.ids;
    IsArray(ids, res);
    const response = await model.updateMany(
      { _id: { $in: ids } },
      { show: status },
      { new: true }
    );
    if (status == false) {
      return Response(res, 200, constants.DELETE_SUCCESS);
    } else if (status == true) {
      return Response(res, 200, constants.UNDO_SUCCESS);
    }
  } catch (error) {
    console.log(model.modelName, error);
    Response(res, 500, constants.GET_ERROR);
  }
};
