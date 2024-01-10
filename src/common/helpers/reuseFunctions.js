const constants = require('./constants')
const {Response} = require('./responseHandler')

exports.removeUndefined = (data) => {
  for (let key in data) {
    if (data[key] === undefined || data[key] === "") {
      delete data[key];
    }
  }
};


exports.capitalizeFirstLetter = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

exports.isAllSameinArray = (dataArray) => {
  if (dataArray.length === 0) return false; // or true, based on how you want to treat an empty array

  const firstElementName = dataArray[0];
  return dataArray.every((item) => item === firstElementName);
};

// exampleCamelCaseString to 'Example Camel Case String'
exports.capitalizeCamelSpace = name => {
  const capitalized =  name.charAt(0).toUpperCase() + name.slice(1)
  return capitalized.replace(/([A-Z])/g, ' $1').trim()
}

exports.IsArray=(data,res)=>{
  if (!data || !Array.isArray(data) || data.length === 0) {
    return Response(res, 400, "Not Found Ids");
  }
 }




 // const oneValueAllowed = (value) => {
//   if (value.processing) {
//     return { ...value, confirmed: undefined };
//   } else if (value.confirmed) {
//     return { ...value, processing: undefined };
//   }
//   return value;
// };

