const { removeMany } = require("./common/controller/remove");
const { createApi } = require("./common/controller/create");
const { updateApi, softRemoveShowStatus,updateManyRecords } = require("./common/controller/update");
const { listCommonAggregationFilterize,aggregationByIds } = require("./common/controller/list");
const { BulkWriteForFile } = require("./common/controller/bulkWrite");
const {
  cloudinaryPushingFiles,
  cloudinaryDeleteFiles,
} = require("./common/controller/cloudinary");
const {CreateFormidableHandler, UpdateFormidableHandler} = require("./common/controller/formidable")
const {createAggregationPipeline,lookupUnwindStage,lookupStage} = require("./common/controller/aggregation")
//helper
const contants = require("./common/helpers/constants")
const { Response } = require("./common/helpers/responseHandler");
const connectdb = require("./common/db/conn") 
// https://chat.openai.com/share/fc950e89-ff5c-4bc1-94b2-3676df116142
module.exports = {
  removeMany,
  createApi,
  updateApi,
  updateManyRecords,
  softRemoveShowStatus,
  listCommonAggregationFilterize,
  aggregationByIds,
  BulkWriteForFile,
  cloudinaryPushingFiles,
  cloudinaryDeleteFiles,
  CreateFormidableHandler,
  UpdateFormidableHandler,
  createAggregationPipeline,
  lookupUnwindStage,
  lookupStage,
  // helper function
  contants,
  Response,
  // db
  connectdb
};
