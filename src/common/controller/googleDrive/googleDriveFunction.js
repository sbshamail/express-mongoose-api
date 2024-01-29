
const { google } = require("googleapis");
const fs=require("fs")

const findFolderByName = async (drive, folderName, parentFolderId = null) => {
  try {
    let query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`;
    if (parentFolderId) {
      query += ` and '${parentFolderId}' in parents`;
    }
    query += ` and trashed = false`; // Check that the folder is not in the trash

    const response = await drive.files.list({
      q: query,
      fields: "files(id, name)",
      spaces: "drive",
    });

    const folder =
      response.data.files.length > 0 ? response.data.files[0] : null;
    return folder ? folder.id : null;
  } catch (error) {
    console.error("Error finding folder:", error);
    throw error;
  }
};

const createFolder = async (authClient, folderName, parentFolderId) => {
  const drive = google.drive({ version: "v3", auth: authClient });
  const fileMetadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
    parents: parentFolderId ? [parentFolderId] : [],
  };

  try {
    const folder = await drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });

    return folder.data.id; // Return the ID of the created folder
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

exports.uploadFilesToGoogleDrive = async (authClient, files,foldering) => {
  const googleDriveResponses = [];
  const drive = google.drive({ version: "v3", auth: authClient });

  // Create a folder first
  let parentFolderId = process.env.parentFolderId; // Root folder ID

  for (const folderName of foldering) {
    let folderId = await findFolderByName(drive, folderName, parentFolderId);
    if (!folderId) {
      folderId = await createFolder(authClient, folderName, parentFolderId);
    }

    parentFolderId = folderId; // Update parentFolderId for nesting
  }
  for (const key of Object.keys(files)) {
    const file = files[key];

    if (file.size > 10000000) {
      throw new Error(`File ${key} should be less than 10MB in size`);
    }
    // console.log(file);
    const fileMetadata = {
      name: file.originalFilename,
      parents: [parentFolderId], // Replace with your folder ID
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.filepath),
    };

    try {
      const driveResponse = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id,name, mimeType, webViewLink",
      });

      const fileInfo = {
        fileId: driveResponse.data.id,
        fileType: driveResponse.data.mimeType,
        fileUrl: driveResponse.data.webViewLink,
        fileName: driveResponse.data.name,
        url:`https://drive.google.com/uc?id=${driveResponse.data.id}`,
      };
      // console.log(fileInfo);

      googleDriveResponses.push(fileInfo);
    } catch (error) {
      console.error("Error uploading to Google Drive:", error);
      throw error;
    }
  }

  return googleDriveResponses;
};

exports.removeFilesFromGoogleDrive=async(authClient, fileIds)=> {
  const drive = google.drive({ version: "v3", auth: authClient });

  for (const fileId of fileIds) {
    try {
      await drive.files.delete({
        fileId: fileId,
      });
      // console.log(`File with ID: ${fileId} has been deleted.`);
    } catch (error) {
      console.error(
        `Error removing file with ID ${fileId} from Google Drive:`,
        error
      );
      // You may choose to throw the error or just log it, depending on how you want to handle partial failures
    }
  }
}
