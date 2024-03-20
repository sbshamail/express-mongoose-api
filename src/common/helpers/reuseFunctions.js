const { Response } = require('./responseHandler');
const moment = require('moment');

exports.removeUndefined = data => {
  for (let key in data) {
    if (data[key] === undefined || data[key] === null || data[key] === '') {
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

  // Add ISO 8601 format and more date formats as needed
  const formats = [
    moment.ISO_8601,
    'DD-MM-YYYY',
    'DD/MM/YYYY',
    'DD-M-YYYY',
    'D-MM-YYYY',
    'D-M-YYYY',
    'D/M/YYYY'
  ];

  const parsedDate = moment(dateString, formats, true);
  if (!parsedDate.isValid()) {
    console.log("Invalid Date Format");
    return null; // Return null if the date is invalid
  }

  return parsedDate.toDate();
};


exports.extractArrayItems = data =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value[0]]));

exports.consoled = (data, ...any) => {
  console.log(JSON.stringify(data, null, 2)); // Log the formatted JSON data
  any.forEach(arg => console.log(arg)); // Log each additional argument
};
// const oneValueAllowed = (value) => {
//   if (value.processing) {
//     return { ...value, confirmed: undefined };
//   } else if (value.confirmed) {
//     return { ...value, processing: undefined };
//   }
//   return value;
// };
