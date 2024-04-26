const { Readable } = require('stream');
const csvParser = require('csv-parser');
const fs = require('fs');
const { removeUndefined, trimNameLower } = require('../helpers/reuseFunctions');
const { Response } = require('../helpers/responseHandler');
const formidable = require('formidable');

function convertCsvToJson(csvData) {
  return new Promise((resolve, reject) => {
    const results = [];
    const parser = csvParser()
      .on('error', error => reject(`Error parsing CSV: ${error.message}`))
      .on('data', row => results.push(row))
      .on('end', () => resolve(results));

    Readable.from(csvData.split('\n')).pipe(parser);
  });
}

const pushDataCsv = async ({ model, fileName, csvFilePath, branch, session }) => {
  const csvData = fs.readFileSync(csvFilePath, 'utf-8');
  try {
    const jsonData = await convertCsvToJson(csvData);
    // Additional validation on jsonData can go here

    jsonData.forEach(data => {
      if (!data.id) {
        throw new Error(`Unique id is not found`);
      }
      removeUndefined(data);
      data.branch = branch;
      data.id = data.id;
      data.fullName = trimNameLower(data.fullName) + ' (khi)';
      if (data.phone) {
        data.phone = '0' + data.phone;
      }
      data.bulkImportDetail = {
        date: new Date(),
        title: fileName + ' ' + data.id
      };
      console.log(`${data.id} on Working, ${data.fullName}`);
    });

    // Start the transaction
    const result = await model.insertMany(jsonData, { session: session });

    return result;
  } catch (error) {
    throw new Error(`Failed to process CSV data: ${error}`);
  }
};

const insertDataCsv = async ({ req, res, model, fileName }) => {
  const branch = req.user.branch._id;
  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject('Error processing form data');
      }
      if (!files?.file?.length) {
        return reject('No files uploaded');
      }

      const csvFilePath = files.file[0].filepath;
      const fileType = files.file[0].mimetype; // Get the MIME type of the file

      // Validate if the uploaded file is a CSV
      if (fileType !== 'text/csv' && !csvFilePath.endsWith('.csv')) {
        // Error response for invalid file type
        // return reject('Invalid file format');
        return Response(res, 400, 'Invalid file format. Only CSV files are accepted.');
      }
      const session = await model.startSession();
      session.startTransaction();
      try {
        // Now, pass the session to pushDataCsv
        const data = await pushDataCsv({ model, fileName, csvFilePath, branch, session });
        await session.commitTransaction();
        session.endSession();

        return Response(res, 200, 'ok', data, data.length);
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        Response(res, 400, error.message);
      } finally {
        // End the session
        if (session) {
          session.endSession();
        }
      }
    });
  });
};

const csvFileHandle = async ({ csvFilePath, fileType, res }) => {
  if (fileType !== 'text/csv' && !csvFilePath.endsWith('.csv')) {
    return Response(res, 400, 'Invalid file format. Only CSV files are accepted.');
  }

  // Read the contents of the CSV file
  const csvData = fs.readFileSync(csvFilePath, 'utf-8');
  // Convert CSV data to JSON
  const jsonData = await convertCsvToJson(csvData);

  jsonData.forEach(data => {
    removeUndefined(data);
  });
  return jsonData;
};

module.exports = {
  insertDataCsv,
  pushDataCsv,
  convertCsvToJson,
  csvFileHandle
};

// const insertDataCsv = async ({req, res,model}) => {
//   const branch = req.user.branch._id;
//   let form = new formidable.IncomingForm();
//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return Response(res, 400, 'all fields required');
//     }
//     // @ts-ignore
//     const csvFilePath = files?.file[0].filepath;
//     const data = await pushDataCsv({ model, csvFilePath, branch });
//     return data;
//   });
// }
