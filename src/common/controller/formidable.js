const formidable = require("formidable");
const {
  cloudinaryPushingFiles,
  cloudinaryDeleteFiles,
} = require("./cloudinary");
const  {Response}  = require("../helpers/responseHandler");

exports.CreateFormidableHandler = async (req, res) => {
  return new Promise((resolve, reject) => {
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        Response(res, 400, "all fields required");
      }
      let cloudinaryResponses = [];
      cloudinaryResponses = await cloudinaryPushingFiles(files);
      const extractFirstItems = (data) =>
        Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, value[0]])
        );

      const extractedFieldData = extractFirstItems(fields);
      const data = {
        ...extractedFieldData,
        files: cloudinaryResponses,
      };
      resolve(data);
    });
  });
};
exports.UpdateFormidableHandler = async (req, res) => {
  return new Promise((resolve, reject) => {
    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        Response(res, 400, "all fields required");
        return reject();
      }

      let cloudinaryResponses = [];
      if (files.files && files.files.length > 0) {
        cloudinaryResponses = await cloudinaryPushingFiles(files);
      }

      const extractFirstItems = (data) =>
        Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, value[0]])
        );
      const extractedFieldData = extractFirstItems(fields);

      let deletedFiles;
      if (
        extractedFieldData.deletedFiles &&
        extractedFieldData.deletedFiles.length > 0
      ) {
        deletedFiles = JSON.parse(extractedFieldData.deletedFiles);
        const deleteFilesResponse = await cloudinaryDeleteFiles(deletedFiles);
        // console.log("deleteFilesResponse",deleteFilesResponse)
        // if (!deleteFilesResponse) {
        //   return Response(res, 400, "deleted Files not Found");
        // }
        extractedFieldData.deletedFiles = deletedFiles;
      }

      const data = {
        ...extractedFieldData,
        files: cloudinaryResponses,
      };

      resolve(data);
    });
  });
};
