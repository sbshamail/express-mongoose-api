//controller -api
const { removeMany } = require("./common/controller/remove");
const { createApi } = require("./common/controller/create");
const {
  updateApi,
  updateMany,
  softRemoveShowStatus,
  updateManyRecords,
} = require("./common/controller/update");
const {
  listAggregation,
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
  CreateHandleFilesGoogleDrive,
  UpdateFilesHandleGoogleDrive,
} = require("./common/controller/googleDrive/main");

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
const {
  removeUndefined,
  IsArray,
  capitalizeFirstLetter,
  isAllSameinArray,
  capitalizeCamelSpace,
  extractArrayItems,
  onlyIntegerAllowed,
} = require("./common/helpers/reuseFunctions");
const { caches, createCache } = require("./common/helpers/node-cache");
const connectdb = require("./common/db/conn");

module.exports = {
  removeMany,
  softRemoveShowStatus,
  createApi,
  //update
  updateApi,
  updateManyRecords,
  BulkWriteForFile,
  updateMany,
  //list
  listCommonAggregationFilterize,
  listAggregation,
  aggregationByIds,
  // cloudinary
  cloudinaryPushingFiles,
  cloudinaryDeleteFiles,
  CreateFormidableHandler,
  UpdateFormidableHandler,
  //googledrive
  CreateHandleFilesGoogleDrive,
  UpdateFilesHandleGoogleDrive,
  // aggregation
  createAggregationPipeline,
  lookupUnwindStage,
  lookupStage,
  // helper functions
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
  capitalizeCamelSpace,
  extractArrayItems,
  onlyIntegerAllowed,
  // node-cache
  caches,
  createCache,
};
