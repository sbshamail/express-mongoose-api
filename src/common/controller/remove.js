const {Response} = require('../helpers/responseHandler')
const {IsArray} = require("../helpers/reuseFunctions")
const constants = require('../helpers/constants')

exports.removeMany = async (req,res, model) => {
  const ids = req.body.ids;
  IsArray(ids,res);
  try {
    await model.deleteMany({ _id: { $in: ids } });
    Response(res, 200, constants.DELETE_SUCCESS);
  } catch (error) {
    console.log(model.modelName, error)
    Response(res, 500, constants.GET_ERROR);
  }
};

