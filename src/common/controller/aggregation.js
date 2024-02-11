const mongoose = require("mongoose");

exports.lookupUnwindStage = (from, localField, foreignField, as) => {
  return [
    {
      $lookup: {
        from: from,
        localField: localField,
        foreignField: foreignField,
        as: as,
      },
    },
    {
      $unwind: {
        path: `$${as}`,
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
};

exports.lookupStage = (from, localField, foreignField, as) => {
  return {
    $lookup: {
      from: from,
      localField: localField,
      foreignField: foreignField,
      as: as,
    },
  };
};

exports.createAggregationPipeline = ({
  skip = 0,
  limit = 100,
  searchTerm = "",
  columnFilters = [],
  deleted = "false",
  sortField = "createdAt",
  sortOrder = -1,
  ids = [],
  customParams,
  branch = "65c336d6355c2fc50b106bd0", // it is fake id, without branch id it does not work
}) => {
  const { projectionFields, searchTerms, numericSearchTerms } = customParams;

  const lookup = customParams.lookup ? customParams.lookup : [];
  const searching = (field) => {
    return {
      [field]: { $regex: searchTerm, $options: "i" },
    };
  };
  let matchStage = {};

  // if (searchTerm || columnFilters.length > 0) {
  // const numericSearchTerm = Number(searchTerm);
  matchStage = {
    ...(searchTerm && {
      $or: [
        ...(numericSearchTerms.length > 0
          ? numericSearchTerms.map((search) => {
              console.log(search);
              const condition = {};
              condition[search] = Number(searchTerm);
              return condition;
            })
          : []),

        ...(searchTerms.length > 0
          ? searchTerms.map((search) => {
              return searching(search);
            })
          : []),
      ],
    }),
    ...(columnFilters.length > 0 && {
      $and: columnFilters.map((column) => ({
        [column.id]: { $regex: column.value, $options: "i" },
      })),
    }),
    deleted: deleted,
  };
  // }
  if (branch) {
    matchStage.$or = matchStage.$or || [];
    matchStage.$or.push(
      { branch: new mongoose.Types.ObjectId(branch) },
      { "branch._id": branch }
    );
  }
  // data
  let dataPipeline = [];
  if (lookup) {
    dataPipeline = dataPipeline.concat(...lookup);
  }
  dataPipeline = dataPipeline.concat([
    { $match: matchStage },
    {
      $match: {
        _id:
          ids.length > 0
            ? { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) }
            : { $exists: true },
      },
    },
    {
      $project: projectionFields,
    },
    { $sort: { [sortField]: sortOrder } },
    { $skip: skip },
    { $limit: limit },
  ]);
 
  let countPipeline = [{ $match: matchStage }, { $count: "count" }];
  return [
    {
      $facet: {
        totalAll: [{ $count: "count" }],
        total: countPipeline,
        data: dataPipeline,
      },
    },
    { $unwind: "$total" },
    { $project: { total: "$total.count", data: "$data" } },
  ];
};


