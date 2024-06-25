const mongoose = require('mongoose');
const { parseDate } = require('../helpers/reuseFunctions');
const moment = require('moment');

const lookupUnwindStage = (from, localField, foreignField, as) => {
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

const lookupStage = (from, localField, foreignField, as) => {
  return {
    $lookup: {
      from: from,
      localField: localField,
      foreignField: foreignField,
      as: as
    }
  };
};

const generateConditions = (filters, numericSearchTerms) => {
  return (
    filters &&
    filters?.length > 0 &&
    filters?.map(column => {
      const condition = {};
      // handle date column search filter
      if (
        column.id === 'createdAt' ||
        column.id === 'updatedAt' ||
        column.id === 'date'
      ) {
        // Handle as date
        const date = parseDate(column.value);
        condition[column.id] = {
          $gte: date,
          $lte: moment(date).endOf('day').toDate() // Cover the entire day
        };
      } else if (
        !isNaN(Number(column.value)) &&
        numericSearchTerms &&
        numericSearchTerms.includes(column.id)
      ) {
        // Handle as numeric
        condition[column.id] = Number(column.value);
      } else if (mongoose.Types.ObjectId.isValid(column.value)) {
        condition[column.id] = new mongoose.Types.ObjectId(column.value);
      } else {
        // Handle as regex (string)
        condition[column.id] = { $regex: column.value, $options: 'i' };
      }
      return condition;
    })
  );
};

const dateStartToEnd = (
  fromDate = null,
  toDate = null,
  matchStage,
  fieldDate = 'createdAt'
) => {
  const fromDateParsed = parseDate(fromDate);
  const toDateParsed = parseDate(toDate);
  matchStage.$and = matchStage.$and || [];

  console.log(fromDateParsed, toDateParsed, fieldDate);
  if (fromDateParsed && toDateParsed) {
    // If both fromDate and toDate are provided, filter by the date range
    matchStage.$and.push(
      { [fieldDate]: { $gte: moment.utc(fromDateParsed).startOf('day').toDate() } },
      { [fieldDate]: { $lte: moment.utc(toDateParsed).endOf('day').toDate() } }
    );
  } else if (fromDateParsed) {
    // If only fromDate is provided, filter for dates equal to or greater than fromDate
    matchStage.$and.push({
      [fieldDate]: {
        $gte: moment.utc(fromDateParsed).startOf('day').toDate()
      }
    });
  } else if (toDateParsed) {
    // If only toDate is provided, filter for dates equal to or less than toDate
    matchStage.$and.push({
      [fieldDate]: {
        $lte: moment.utc(toDateParsed).endOf('day').toDate()
      }
    });
  }
};

const checkBranch = (matchStage, branch) => {
  matchStage.$and = matchStage.$and || [];
  if (mongoose.Types.ObjectId.isValid(branch)) {
    matchStage.$and.push({
      $or: [
        { branch: new mongoose.Types.ObjectId(branch) },
        { shareBranch: new mongoose.Types.ObjectId(branch) }
      ]
    });
  } else {
    console.log('Branch Is Invalid');
  }
};

const createAggregationPipeline = ({
  skip = 0,
  limit = 1000000,
  searchTerm = '',
  columnFilters = [],
  columnFiltersOr = [],
  deleted = 'false',
  sortField = 'updatedAt',
  sortOrder = -1,
  ids = [],
  customParams,
  branch = '65c336d6355c2fc50b106bd0' // it is fake id, without branch id it does not work
}) => {
  const {
    projectionFields,
    searchTerms,
    numericSearchTerms,
    fromDate,
    toDate,
    fieldDate
  } = customParams;

  if (columnFilters) {
    columnFilters = columnFilters.map(column => {
      return column.id === 'by' ? { ...column, id: 'agent.fullName' } : column;
    });
  }
  const lookup = customParams.lookup ? customParams.lookup : [];
  const searching = field => {
    if (mongoose.Types.ObjectId.isValid(searchTerm)) {
      return { [field]: new mongoose.Types.ObjectId(searchTerm) };
    }
    return {
      [field]: { $regex: searchTerm, $options: 'i' }
    };
  };
  let matchStage = {};

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
    deleted: deleted
  };
  if (columnFilters && columnFilters.length) {
    matchStage.$and = generateConditions(columnFilters, numericSearchTerms);
  }
  if (columnFiltersOr && columnFiltersOr.length) {
    matchStage.$or = generateConditions(columnFilters, numericSearchTerms);
  }
  if (fromDate || toDate) {
    dateStartToEnd(fromDate, toDate, matchStage, fieldDate);
  }
  if (branch) {
    checkBranch(matchStage, branch);
  }
  // data
  let dataPipeline = [];
  // console.log('matchstage', matchStage);
  if (lookup) {
    dataPipeline = dataPipeline.concat(...lookup);
  }
  let countPipeline = [{ $count: 'total' }];

  dataPipeline = dataPipeline.concat([
    { $match: matchStage },
    {
      $facet: {
        totalRecords: countPipeline,
        extra: [{ $group: { _id: null, startDate: { $min: '$updatedAt' } } }],
        data: [
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
        ]
      }
    },
    { $unwind: '$totalRecords' },
    { $unwind: '$extra' },
    {
      $project: {
        total: '$totalRecords.total',
        data: '$data',
        extra: '$extra'
      }
    }
  ]);
  return dataPipeline;
};

module.exports = {
  createAggregationPipeline,
  lookupStage,
  lookupUnwindStage,
  dateStartToEnd,
  generateConditions,
  checkBranch
};
