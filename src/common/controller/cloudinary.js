const cloudinary = require("cloudinary").v2;


exports.cloudinaryPushingFiles = async (files) => {
  if (files.files && files.files.length > 0) {
    const filesCollection = files.files;
    // @ts-ignore
    const fileKeys = Object.keys(filesCollection);
    // cloudinary
    const cloudinaryResponses = [];
    for (const key of fileKeys) {
      // @ts-ignore
      const file = filesCollection[key];
      if (file.size > 10000000) {
        return res.status(400).json({
          error: `File ${key} should be less than 10mb in size`,
        });
      }
      const fileNameWithExtension = file.originalFilename;
      const cloudinaryResponse = await cloudinary.uploader.upload(
        file.filepath,
        {
          resource_type: "raw",
          // public_id: fileNameWithExtension,
          folder: "hamail",
          name: fileNameWithExtension,
        }
      );
      // const fileNameWithExtension = `${cloudinaryResponse.original_filename}.${cloudinaryResponse.format}`;
      // console.log(cloudinaryResponse);
      cloudinaryResponses.push({
        url: cloudinaryResponse.secure_url,
        // fields: "passport",
        public_id: cloudinaryResponse.public_id,
        type: cloudinaryResponse.format,
        name: cloudinaryResponse.original_filename,
      });
    }
    return cloudinaryResponses;
  }
};

exports.cloudinaryDeleteFiles = async(deletedFiles) => {
//   const deleted = await cloudinary.api.delete_resources(deletedFiles);
//   console.log(deleted)
// return deleted
  if (deletedFiles && deletedFiles.length > 0) {
    const deletePromises = deletedFiles.map((public_id) => {
      if (public_id && typeof public_id === "string") {
      
        return new Promise((resolve, reject) => {
          
          cloudinary.uploader.destroy(public_id, (err, result) => {
            console.log("result",public_id)
            if (err) {
              return reject(err);
            } else {
              resolve(public_id); // Resolve with public_id to know which ones were deleted
            }
          });
        });
      } else {
        return;
      }
    });
    Promise.all(deletePromises).then((deletedPublicIds) => {
      console.log("deletedPublicIds", deletedPublicIds);
      return deletedPublicIds
    });
  }
};



