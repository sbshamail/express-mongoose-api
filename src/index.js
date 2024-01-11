//controller -api
const { removeMany } = require("./common/controller/remove");
const { createApi } = require("./common/controller/create");
const {
  updateApi,
  softRemoveShowStatus,
  updateManyRecords,
} = require("./common/controller/update");
const {
  listCommonAggregationFilterize,
  aggregationByIds,
} = require("./common/controller/list");
const { BulkWriteForFile } = require("./common/controller/bulkWrite");
const {
  cloudinaryPushingFiles,
  cloudinaryDeleteFiles,
} = require("./common/controller/cloudinary");
const {
  CreateFormidableHandler,
  UpdateFormidableHandler,
} = require("./common/controller/formidable");
const {
  createAggregationPipeline,
  lookupUnwindStage,
  lookupStage,
} = require("./common/controller/aggregation");
//helper
const constants = require("./common/helpers/constants");
const { Response } = require("./common/helpers/responseHandler");
const {
  handleAsyncSession,
  handleAsync,
} = require("./common/helpers/handleAsync");
const { handleError } = require("./common/helpers/errorHandler");
const { removeUndefined,IsArray,capitalizeFirstLetter,isAllSameinArray,capitalizeCamelSpace } = require("./common/helpers/reuseFunctions");
const connectdb = require("./common/db/conn");

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
  constants,
  Response,
  //handle async
  handleAsyncSession,
  handleAsync,
  // db
  connectdb,
  //handle error
  handleError,
  //reuse function
  removeUndefined,
  IsArray,
  capitalizeFirstLetter,
  isAllSameinArray,
  capitalizeCamelSpace
};
