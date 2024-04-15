//controller -api
const { removeMany } = require('./common/controller/remove');
const { createApi } = require('./common/controller/create');

const {
  updateApi,
  updateManyByIds,
  // softRemoveShowStatus,
  updateManyRecords,
  updateFieldAll
  // updateAddNewField
} = require('./common/controller/update');
const {
  listCommonAggregationFilterize,
  listAggregation,
  listAggregationV2,
  aggregationByIds
} = require('./common/controller/list');
const { BulkWriteForFile } = require('./common/controller/bulkWrite');
const {
  cloudinaryPushingFiles,
  cloudinaryDeleteFiles
} = require('./common/controller/cloudinary');
const {
  CreateFormidableHandler,
  UpdateFormidableHandler
} = require('./common/controller/formidable');

const {
  CreateHandleFilesGoogleDrive,
  UpdateFilesHandleGoogleDrive
} = require('./common/controller/googleDrive/main');

const {
  createAggregationPipeline,
  lookupUnwindStage,
  lookupStage
} = require('./common/controller/aggregation');
//helper
const constants = require('./common/helpers/constants');
const { Response } = require('./common/helpers/responseHandler');
const { handleAsyncSession, handleAsync } = require('./common/helpers/handleAsync');
const { handleError } = require('./common/helpers/errorHandler');
const {
  isAllSameinArray,
  removeUndefined,
  IsArray,
  capitalizeFirstLetter,
  capitalizeCamelSpace,
  onlyIntegerAllowed,
  extractArrayItems,
  parseDate,
  consoled
} = require('./common/helpers/reuseFunctions');
const {
  caches,
  clearCache,
  createCache,
  removeCacheEntry,
  clearAllCaches
} = require('./common/helpers/node-cache');
const { sendEmail, testEmail } = require('./common/helpers/nodemailer');
const {
  insertDataCsv,
  pushDataCsv,
  convertCsvToJson,
  csvFileHandle
} = require('./common/controller/csvFileImport');
const connectdb = require('./common/db/conn');

module.exports = {
  removeMany,
  // softRemoveShowStatus,
  createApi,
  //update
  updateFieldAll,
  updateApi,
  updateManyRecords,
  BulkWriteForFile,
  updateManyByIds,
  // updateAddNewField,
  //list
  listCommonAggregationFilterize,
  listAggregation,
  listAggregationV2,
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
  //nodemailer
  sendEmail,
  testEmail,
  // csv File Handling
  insertDataCsv,
  pushDataCsv,
  convertCsvToJson,
  csvFileHandle,
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
  isAllSameinArray,
  removeUndefined,
  IsArray,
  capitalizeFirstLetter,
  capitalizeCamelSpace,
  onlyIntegerAllowed,
  extractArrayItems,
  consoled,
  parseDate,
  Response,
  // node-cache
  caches,
  clearCache,
  createCache,
  removeCacheEntry,
  clearAllCaches
};
