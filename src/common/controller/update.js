const { removeUndefined } = require('../helpers/reuseFunctions');
const { Response } = require('../helpers/responseHandler');
const constants = require('../helpers/constants');

exports.updateApi = async (model, id, data, options = {}) => {
  removeUndefined(data);
  const response = await model.findByIdAndUpdate(id, data, {
    new: true,
    ...options // Spread the options object here
  });
  return response;
};
exports.updateOnly = async (model, id, data, options = {}) => {
  removeUndefined(data);
  const response = await model.updateOne({ _id: id }, data, {
    new: true,
    ...options // Spread the options object here
  });
  return response;
};

exports.updateManyRecords = async (model, ids, data, options = {}) => {
  return await model.updateMany(
    { _id: { $in: ids } },
    data,
    { ...options, new: true } // Merge options with new:true
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
      return Response(res, 400, 'No data Found For Update');
    }
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return Response(res, 400, 'Not Found Ids');
    }
    const response = await model.updateMany({ _id: { $in: ids } }, updateData, {
      new: true
    });
    return response;
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
