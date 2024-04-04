const mongoose = require("mongoose");
const { parseDate } = require('../helpers/reuseFunctions');
const moment = require("moment");

exports.lookupUnwindStage = (from, localField, foreignField, as) => {
  return [
    {
      $lookup: {
        from: from,
        localField: localField,
        foreignField: foreignField,
        as: as
      }
    },
    {
      $unwind: {
        path: `$${as}`,
        preserveNullAndEmptyArrays: true
      }
    }
  ];
};

exports.lookupStage = (from, localField, foreignField, as) => {
  return {
    $lookup: {
      from: from,
      localField: localField,
      foreignField: foreignField,
      as: as
    }
  };
};

exports.matchStageFilterize = ({
  searchTerm,
  branch,
  searchTerms=[],
  numericSearchTerms=[],
  columnFilters,
  deleted,
  matchStage
}) => {

  const searching = field => ({ [field]: { $regex: new RegExp(searchTerm, 'i') } });

  const conditions = [];

  // Add search term conditions
  if (searchTerm) {
    const searchConditions = [
      ...(numericSearchTerms && numericSearchTerms.length > 0
        ? numericSearchTerms.map(search => ({ [search]: Number(searchTerm) }))
        : []),
      ...(searchTerms.length > 0 ? searchTerms.map(searching) : [])
    ];
    conditions.push({ $or: searchConditions });
  }

  // Add column filter conditions
  if (columnFilters && columnFilters.length > 0) {
    const columnConditions = columnFilters.map(column => {
      const condition = {};
      if (
        !isNaN(Number(column.value)) &&
        numericSearchTerms &&
        numericSearchTerms.includes(column.id)
      ) {
        condition[column.id] = Number(column.value);
      } else {
        condition[column.id] = { $regex: column.value, $options: 'i' };
      }
      return condition;
    });
    conditions.push({ $and: columnConditions });
  }

  // Add deleted condition
  if (deleted) {
    conditions.push({ deleted });
  }

  // Add branch condition
  if (branch) {
    const branchConditions = [
      { branch: new mongoose.Types.ObjectId(branch) },
      { 'branch._id': branch }
    ];
    conditions.push({ $or: branchConditions });
  }
  // Combine all conditions
  matchStage = { $and: conditions };
 
  return matchStage;
};

exports.createAggregationPipeline = ({
  skip = 0,
  limit = 100,
  searchTerm = '',
  columnFilters = [],
  deleted = 'false',
  sortField = 'createdAt',
  sortOrder = -1,
  ids = [],
  customParams,
  branch = '65c336d6355c2fc50b106bd0' // it is fake id, without branch id it does not work
}) => {
  const { projectionFields, searchTerms, groupField, numericSearchTerms } = customParams;
   if (columnFilters) {
    columnFilters = columnFilters.map(column => {
      return column.id === 'by' ? { ...column, id: 'agent.fullName' } : column;
    });
  }
  const lookup = customParams.lookup ? customParams.lookup : [];
  const searching = field => {
    return {
      [field]: { $regex: searchTerm, $options: 'i' }
    };
  };
  let matchStage = {};

  const numericSearchTerm = Number(searchTerm);
  matchStage = {
    ...matchStage,
    ...(searchTerm && {
      $or: [
        ...(numericSearchTerms && numericSearchTerms.length > 0
          ? numericSearchTerms.map(search => {
              const condition = {};
              condition[search] = Number(searchTerm);
              return condition;
            })
          : []),

        ...(searchTerms.length > 0
          ? searchTerms.map(search => {
              return searching(search);
            })
          : [])
      ]
    }),
    // ...(columnFilters.length > 0 && {
    //   $and: columnFilters.map((column) => ({
    //     [column.id]: { $regex: column.value, $options: "i" },
    //   })),
    // }),
    ...(columnFilters && columnFilters.length > 0 && {
      $and: columnFilters.map(column => {
        const condition = {};

        if (column.id === 'createdAt' || column.id === 'updatedAt') {
          // Handle as date
          const date = parseDate(column.value);
          condition[column.id] = {
            $gte: date,
            $lte: moment(date).endOf('day').toDate() // Cover the entire day
          };
        } 
        else if (
          !isNaN(Number(column.value)) &&
          numericSearchTerms &&
          numericSearchTerms.includes(column.id)
        ) {
          // Handle as numeric
          condition[column.id] = Number(column.value);
        } else {
          // Handle as regex (string)
          condition[column.id] = { $regex: column.value, $options: 'i' };
        }

        return condition;
      })
    }),

    // ...(columnFilters &&
    //   columnFilters.length > 0 && {
    //     $and: columnFilters.map(column => {
    //       const condition = {};
    //       const alwaysTreatAsString = searchTerms; // Add field identifiers here
    //       if (
    //         !isNaN(Number(column.value)) &&
    //         numericSearchTerms &&
    //         numericSearchTerms.includes(column.id)
    //       ) {
    //         condition[column.id] = Number(column.value);
    //       } else {
    //         condition[column.id] = { $regex: column.value, $options: 'i' };
    //       }
    //       return condition;
    //     })
    //   }),
    deleted: deleted
  };
  if (branch) {
    matchStage.$and = matchStage.$and || [];
    if (mongoose.Types.ObjectId.isValid(branch)) {
      matchStage.$and.push({
        $or: [{ branch: new mongoose.Types.ObjectId(branch) }, { 'branch._id': branch }]
      });
    } else {
      matchStage.$and.push({
        'branch._id': branch
      });
    }
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
            ? { $in: ids.map(id => new mongoose.Types.ObjectId(id)) }
            : { $exists: true }
      }
    },
    {
      $project: projectionFields
    },
    { $sort: { [sortField]: sortOrder } },
    { $skip: skip },
    { $limit: limit }
  ]);
  // let countPipeline = [{ $match: matchStage }, { $count: 'count' }];
  let countPipeline = [{ $count: 'count' }];
  return [
    {
      $facet: {
        totalAll: [{ $count: 'count' }],
        data: dataPipeline,
        total: countPipeline
      }
    },
    { $unwind: '$total' },
    { $project: { total: '$total.count', data: '$data' } }
  ];
};

