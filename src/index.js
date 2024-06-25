//controller -api
const {
  removeMany,
  removedMany,
  removedStatus,
  removedStatusNext,
  removedManyNext
} = require('./common/controller/remove');
const { createApi } = require('./common/controller/create');

const {
  updateApi,
  updateOnly,
  updateManyByIds,
  // softRemoveShowStatus,
  updateManyRecords,
  updateFieldAll
  // updateAddNewField
} = require('./common/controller/update');
const {
  listCommonAggregationFilterize,
  listAggregation,
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
  UpdateFilesHandleGoogleDrive,
  CreateHandleFilesGoogleDriveV2,
  UpdateFilesHandleGoogleDriveV2
} = require('./common/controller/googleDrive/main');

const {
  createAggregationPipeline,
  lookupUnwindStage,
  lookupStage
} = require('./common/controller/aggregation');
//helper
const constants = require('./common/helpers/constants');
const { Response } = require('./common/helpers/responseHandler');
const {
  handleAsyncSession,
  handleAsync,
  handleFormAsyncSession
} = require('./common/helpers/handleAsync');
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
  trimNameLower,
  consoled,
  handleNumberValues,
  parseJsonFields,
  pickObj
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
  convertCsvToJson,
  csvFileHandle
} = require('./common/controller/csvFileImport');
const connectdb = require('./common/db/conn');

module.exports = {
  //remove
  removeMany,
  removedStatus,
  removedStatusNext,
  removedManyNext,
  removedMany,
  // softRemoveShowStatus,
  createApi,
  //update
  updateFieldAll,
  updateApi,
  updateOnly,
  updateManyRecords,
  BulkWriteForFile,
  updateManyByIds,
  // updateAddNewField,
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
  CreateHandleFilesGoogleDriveV2,
  UpdateFilesHandleGoogleDriveV2,
  // aggregation
  createAggregationPipeline,
  lookupUnwindStage,
  lookupStage,
  //nodemailer
  sendEmail,
  testEmail,
  // csv File Handling
  insertDataCsv,
  convertCsvToJson,
  csvFileHandle,
  // helper functions
  constants,
  Response,
  //handle async
  handleAsyncSession,
  handleAsync,
  handleFormAsyncSession,
  // db
  connectdb,
  //handle error
  handleError,
  //reuse function
  pickObj,
  trimNameLower,
  isAllSameinArray,
  removeUndefined,
  IsArray,
  capitalizeFirstLetter,
  capitalizeCamelSpace,
  onlyIntegerAllowed,
  extractArrayItems,
  consoled,
  handleNumberValues,
  parseDate,
  parseJsonFields,
  Response,
  // node-cache
  caches,
  clearCache,
  createCache,
  removeCacheEntry,
  clearAllCaches
};
