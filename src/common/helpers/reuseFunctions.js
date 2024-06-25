const { Response } = require('./responseHandler');
const moment = require('moment-timezone');

exports.removeUndefined = data => {
  for (let key in data) {
    if (
      data[key] === undefined ||
      data[key] === null ||
      data[key] === '' ||
      data[key] === 'null' ||
      data[key] === 'undefined'
    ) {
      delete data[key];
    }
  }
};

exports.IsArray = (data, res) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return Response(res, 400, 'Not Found Ids');
  }
};

exports.capitalizeFirstLetter = name => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

//send array and check all is same
exports.isAllSameinArray = (dataArray, name) => {
  if (dataArray.length === 0) return false; // or true, based on how you want to treat an empty array

  const firstElementName = name ?? dataArray[0];
  return dataArray.every(item => item === firstElementName);
};

// handleNumberValues(req.body, numberProperties);
// const numberProperties = [
//   'hotelCost',
//   'sellingPrice',
// ];
exports.handleNumberValues = (fields, properties) => {
  properties.forEach(property => {
    if (fields[property]) {
      fields[property] = Number(fields[property]);
    }
  });
};

// exampleCamelCaseString to 'Example Camel Case String'
exports.capitalizeCamelSpace = name => {
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return capitalized.replace(/([A-Z])/g, ' $1').trim();
};

// only integer allowed
exports.onlyIntegerAllowed = number => {
  if (number !== undefined && /^\d+$/.test(number)) {
    return (number = Number(number));
  } else {
    return { error: 'Missing or contains non-numeric characters' };
  }
};
exports.parseDate = dateString => {
  if (!dateString) return null; // handle null or undefined
  let parsedDate = moment(dateString, moment.ISO_8601, true);
  // Add ISO 8601 format and more date formats as needed
  if (!parsedDate.isValid()) {
    const formats = [
      'DD-MM-YYYY',
      'DD/MM/YYYY',
      'D/M/YYYY',
      'DD/M/YYYY',
      'D/MM/YYYY',
      'DD-M-YYYY',
      'D-MM-YYYY',
      'D-M-YYYY',
      'D-MMM-YY', // Added to handle dates like '5-Nov-22'
      'DD-MMM-YY', // Handles two-digit day, abbreviated month, two-digit year
      'D-MMM-YYYY' // Single-digit day, abbreviated month, four-digit year
    ];
    parsedDate = moment.utc(dateString, formats, true);
  }
  if (!parsedDate.isValid() && /\bGMT[+-]\d{4}\b/.test(dateString)) {
    const timeZoneDate = moment.tz(
      dateString,
      'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ',
      'Asia/Karachi'
    );
    if (timeZoneDate.isValid()) {
      return timeZoneDate.toDate();
    }
  }

  if (parsedDate.isValid()) {
    return parsedDate.toDate();
  } else {
    console.log('Invalid Date Format:', dateString);
    return null;
  }
};

exports.extractArrayItems = data =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value[0]]));

exports.consoled = (data, ...any) => {
  console.log(JSON.stringify(data, null, 2)); // Log the formatted JSON data
  any.forEach(arg => console.log(arg)); // Log each additional argument
};

// let input = "   Hello   world!   This is    a test.  ";
// "Hello world! This is a test."
exports.trimNameLower = name => {
  if (typeof name !== 'string') {
    throw new Error('Invalid type, expected string');
  }
  // Log the original name for debugging
  console.log('Original name:', JSON.stringify(name));
  const trimmedName = name
    .replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  // Log the trimmed name for debugging
  console.log('Trimmed name:', JSON.stringify(trimmedName));
  return trimmedName;
};

//fields ['destination', 'duration', 'type', 'category'];
//data: {destination:{},duration:{},type:{},category:{}}
exports.parseJsonFields = (data, fields) => {
  const parsedData = {};
  for (const field of fields) {
    if (typeof data[field] !== 'string') {
      return { error: `Field '${field}' must be a properly defined JSON string.` };
    }
    try {
      parsedData[field] = JSON.parse(data[field]);
    } catch (error) {
      return { error: `Error parsing '${field}': ${error.message}` };
    }
  }
  return parsedData;
};

// const data = pick(req.body, [
//   'title',
//   'description',
//   'date'
// ]);
exports.pickObj = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};
// const oneValueAllowed = (value) => {
//   if (value.processing) {
//     return { ...value, confirmed: undefined };
//   } else if (value.confirmed) {
//     return { ...value, processing: undefined };
//   }
//   return value;
// };
