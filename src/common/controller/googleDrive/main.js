const { google } = require('googleapis');

const { Response } = require('../../helpers/responseHandler');

// const apikeys = require("../../../../../apikeys.json");
const SCOPE = ['https://www.googleapis.com/auth/drive'];
const {
  uploadFilesToGoogleDrive,
  removeFilesFromGoogleDrive
} = require('./googleDriveFunction');

// A Function that can provide access to google drive api
async function authorize() {
  const jwtClient = new google.auth.JWT(
    // apikeys.client_email,
    process.env.CLIENT_EMAIL,
    null,
    // apikeys.private_key,
    process.env.PRIVATE_KEY,
    SCOPE
  );

  await jwtClient.authorize();

  return jwtClient;
}

exports.CreateHandleFilesGoogleDrive = async (req, res, model, data) => {
  let foldering = data.foldering;
  let files = req.files;
  // allowed files is int schema methods check the allowed files
  if (files && files.length > 0 && model.allowedFiles) {
    try {
      model.allowedFiles(files);
    } catch (error) {
      // console.error(error.message);
      return Response(res, 400, error.message);
    }
  }
  try {
    // Upload files to Google Drive
    const authClient = await authorize();
    let googleDriveResponses = [];
    if (files && files.length > 0) {
      googleDriveResponses = await uploadFilesToGoogleDrive(authClient, files, foldering);
    }

    const newData = {
      ...data,
      files: googleDriveResponses
    };
    return newData;
  } catch (error) {
    // console.error(error.message);
    return Response(res, 400, error.message);
  }
};

exports.UpdateFilesHandleGoogleDrive = async (req, res, model, data) => {
  let foldering = data.foldering;
  let files = req.files;
  // allowed files is int schema methods check the allowed files
  // if (files && files.length > 0 && model.allowedFiles) {
  //   try {
  //     model.allowedFiles(files);
  //   } catch (error) {
  //     // console.error(error.message);
  //     return Response(res, 400, error.message);
  //   }
  // }

  try {
    // Upload files to Google Drive
    const authClient = await authorize();
    let googleDriveResponses = [];
    if (files && files.length > 0) {
      googleDriveResponses = await uploadFilesToGoogleDrive(authClient, files, foldering);
    }

    let deletedFiles;
    if (data.deletedFiles && data.deletedFiles.length > 0) {
      // deletedFiles = JSON.parse(data.deletedFiles);
      const deleteFilesResponse = await removeFilesFromGoogleDrive(
        authClient,
        deletedFiles
      );
      // console.log("deleteFilesResponse",deleteFilesResponse)
      // if (!deleteFilesResponse) {
      //   return Response(res, 400, "deleted Files not Found");
      // }
      data.deletedFiles = deletedFiles;
    }

    const newData = {
      data,
      files: googleDriveResponses
    };

    return newData;
  } catch (error) {
    return Response(res, 400, error.message);
  }
};

exports.CreateHandleFilesGoogleDriveV2 = async (files, foldering) => {
  if (!files && !foldering) {
    return {
      isValid: false,
      message: 'Missing files or folders'
    };
  }
  try {
    // Upload files to Google Drive
    const authClient = await authorize();
    let googleDriveResponses = [];
    if (files && files.length > 0) {
      googleDriveResponses = await uploadFilesToGoogleDrive(authClient, files, foldering);
    }
    return googleDriveResponses;
  } catch (error) {
    // console.error(error.message);
    return {
      isValid: false,
      message: error.message
    };
  }
};

exports.UpdateFilesHandleGoogleDriveV2 = async (files, foldering, deletedFiles) => {
  // allowed files is int schema methods check the allowed files
  // if (files && files.length > 0 && model.allowedFiles) {
  //   try {
  //     model.allowedFiles(files);
  //   } catch (error) {
  //     // console.error(error.message);
  //     return Response(res, 400, error.message);
  //   }
  // }
  try {
    // Upload files to Google Drive
    const authClient = await authorize();
    let googleDriveFiles = [];
    if (files && files.length > 0) {
      googleDriveFiles = await uploadFilesToGoogleDrive(authClient, files, foldering);
    }
    let filesDeleted = undefined;
    if (deletedFiles && deletedFiles.length > 0) {
      // deletedFiles = JSON.parse(data.deletedFiles);
      const deleteFilesResponse = await removeFilesFromGoogleDrive(
        authClient,
        deletedFiles
      );
      // console.log("deleteFilesResponse",deleteFilesResponse)
      // if (!deleteFilesResponse) {
      //   return Response(res, 400, "deleted Files not Found");
      // }
      filesDeleted = deletedFiles;
    }

    return { googleDriveFiles, filesDeleted };
  } catch (error) {
    return {
      isValid: false,
      message: error.message
    };
  }
};
