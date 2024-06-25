const mongoose = require('mongoose');

/**
 * Perform a bulk write operation for a file.
 * @param {Object} options - Options for the bulk write operation.
 * @param {string} options.id - The ID of the document to update.
 * @param {string} options.fileId - The ID of the document to update.
 * @param {Object} options.data - The data to set in the update.
 * @param {Array} options.files - An array of files to add.
 * @param {Array} options.deletedFiles - An array of files to delete.
 * @param {Model} options.model - The MongoDB model to use for the bulk write.
 * @param {ClientSession} [options.session] - Optional MongoDB session.
 * @returns {Promise<Object>}
 */

exports.BulkWriteForFile = async ({
  id,
  data,
  files,
  fileId,
  deletedFiles,
  model,
  session
}) => {
  const hasFilesToAdd = files && files.length > 0;
  const hasFilesToDelete = deletedFiles && deletedFiles.length > 0;

  const validId = new mongoose.Types.ObjectId(id);

  const updateOperations = [];

  // Always update the main data
  updateOperations.push({
    updateOne: {
      filter: { _id: validId },
      update: { $set: data }
    }
  });
  // Add files if necessary
  if (hasFilesToAdd) {
    updateOperations.push({
      updateOne: {
        filter: { _id: validId },
        update: { $addToSet: { files: { $each: files } } } // Directly using files
      }
    });
  }

  // Remove files if necessary
  if (hasFilesToDelete) {
    updateOperations.push({
      updateOne: {
        filter: { _id: validId },
        update: { $pull: { files: { [fileId]: { $in: deletedFiles } } } }
      }
    });
  }

  const bulkWriteOptions = { ordered: false };
  if (session) {
    bulkWriteOptions.session = session;
  }
  const bulkResponse = await model.bulkWrite(updateOperations, bulkWriteOptions);
  return bulkResponse;
};
