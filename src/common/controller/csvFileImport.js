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

async function fetchExistingImportIds(importIds, model) {
  const existingRecords = await model
    .find({ importId: { $in: importIds } }, { importId: 1 })
    .lean();
  return new Set(existingRecords.map(record => record.importId));
}

const insertDataCsv = async ({ req, res, model }) => {
  const form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject('Error processing form data');
      }
      if (!files?.file?.length) {
        return reject('No files uploaded');
      }
      const title = fields.title ? fields?.title[0] : undefined;
      const csvFilePath = files.file[0].filepath;
      const fileType = files.file[0].mimetype; // Get the MIME type of the file

      // Validate if the uploaded file is a CSV
      if (fileType !== 'text/csv' && !csvFilePath.endsWith('.csv')) {
        // Error response for invalid file type
        // return reject('Invalid file format');
        return Response(res, 400, 'Invalid file format. Only CSV files are accepted.');
      }

      try {
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');
        const jsonData = await convertCsvToJson(csvData);

        // filtering already inserting importId
        const allImportIds = jsonData.map(item => item.id);
        const existingImportIds = await fetchExistingImportIds(allImportIds, model);
        const filteredData = jsonData.filter(item => !existingImportIds.has(item.id));
        resolve({ filteredData, title }); // Successfully resolve with the result
      } catch (error) {
        Response(res, 400, error.message);
        reject(error.message); // Reject with the error message
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
  convertCsvToJson,
  csvFileHandle
};
