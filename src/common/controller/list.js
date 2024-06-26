const constants = require('../helpers/constants');
const { Response } = require('../helpers/responseHandler');
const { createAggregationPipeline } = require('./aggregation');

exports.listCommonAggregationFilterize = async (
  req,
  res,
  model,
  createAggregationPipeline,
  customParams
) => {
  try {
    const { searchTerm, sortField, columnFilters, deleted } = req.query;
    const { branch } = req.user;
    if (!branch || !branch._id) {
      return;
    }
    let sortOrder = req.query?.sortOrder ? parseInt(req.query?.sortOrder) : -1;
    let columnFiltersArray = [];
    if (columnFilters) {
      columnFiltersArray = JSON.parse(columnFilters);
    }
    let limit = req.query?.limit ? parseInt(req.query?.limit) : 20;
    let page = req.query?.page ? parseInt(req.query?.page) : 1;
    page === 0 ? (page = 1) : (page = page);
    let skip = (page - 1) * limit;
    const pipeline = createAggregationPipeline({
      skip,
      limit,
      searchTerm,
      sortField: sortField ? sortField : 'createdAt',
      sortOrder: sortOrder ? sortOrder : 1,
      columnFilters: columnFiltersArray,
      deleted: deleted,
      customParams,
      branch: branch._id
    });
    // @ts-ignore
    const result = await model.aggregate(pipeline);

    const total = result.length > 0 ? result[0].total : 0;
    const data = result.length > 0 ? result[0].data : [];

    Response(res, 200, 'ok', data, total);
  } catch (error) {
    console.log(model.modelName, error);
    Response(res, 400, constants.GET_ERROR);
  }
};

function addRowNumbers(data, pageNumber, pageSize) {
  return data.map((item, index) => {
    return {
      ...item,
      rowNum: (pageNumber - 1) * pageSize + index + 1
    };
  });
}

exports.listAggregation = async (
  req,
  res,
  model,
  createAggregationPipeline,
  customParams,
  cache
) => {
  try {
    const { searchTerm, sortField, columnFilters, columnFiltersOr, deleted } =
      req.query || {};
    // console.log(columnFiltersOr);
    customParams.fromDate = req.query.fromDate;
    customParams.toDate = req.query.toDate;
    customParams.fieldDate = req.query.fieldDate;
    const { branch } = req.user;
    if (!branch || !branch._id) {
      return;
    }

    // console.log('branch', branch.name, branch._id, 'name', req.user.username);
    let sortOrder = req.query?.sortOrder ? parseInt(req.query?.sortOrder) : -1;
    let columnFiltersArray = [];
    let columnFiltersOrArray = [];
    if (columnFilters) {
      columnFiltersArray = JSON.parse(columnFilters);
    }
    if (columnFiltersOr) {
      columnFiltersOrArray = JSON.parse(columnFiltersOr);
    }
    let limit = req.query?.limit ? parseInt(req.query?.limit) : 1000;
    let page = req.query?.page ? parseInt(req.query?.page) : 1;
    page === 0 ? (page = 1) : (page = page);
    let skip = (page - 1) * limit;

    const pipeline = createAggregationPipeline({
      skip,
      limit,
      searchTerm,
      sortField: sortField ? sortField : 'createdAt',
      sortOrder: sortOrder ? sortOrder : -1,
      columnFilters: columnFiltersArray,
      columnFiltersOr: columnFiltersOrArray,
      deleted,
      customParams,
      branch: branch._id
    });
    let result = [];
    if (cache) {
      result = await model.aggregate(pipeline).cache({ key: cache });
    } else {
      result = await model.aggregate(pipeline);
    }

    const total = result.length > 0 ? result[0].total : 0;
    const extra = result.length > 0 ? result[0].extra : 0;
    const data = result.length > 0 ? result[0].data : [];
    const dataWithRowNumbers = addRowNumbers(data, page, limit);

    return {
      total: total,
      extra: extra,
      data: dataWithRowNumbers
    };
    // return { total, data }
  } catch (error) {
    console.log(model.modelName, error);
    Response(res, 400, constants.GET_ERROR);
  }
};

/**
 * Perform a bulk write operation for a file.
 * @param {Object} options - Options for the bulk write operation.
 * @param {Model} options.model - The ID of the document to update.
 * @param {Object} options.customParams - The data to set in the update.
 * @param {Object} options.ids
 * @param {Function} [options.ownPipeline] - Optional MongoDB session.
 * @param {Request} options.req - Optional MongoDB session.
 * @param {Object} [options.session]
 * @returns {Promise<Object>}
 */

exports.aggregationByIds = async ({
  model,
  ids,
  customParams,
  ownPipeline,
  req,
  session = null
}) => {
  // find id required branch and ids
  const user = req.user;
  const document = ids && ids?.length ? ids : [ids];
  let pipeline;
  if (customParams) {
    // @ts-ignore
    pipeline = createAggregationPipeline({
      ids: document,
      customParams,
      branch: req.body.branch ?? user.branch._id
    });
  } else if (ownPipeline) {
    // @ts-ignore
    pipeline = ownPipeline({ ids: document, branch: req.body.branch ?? user.branch._id });
  }

  // @ts-ignore
  let aggregateResult;
  if (session) {
    aggregateResult = await model.aggregate(pipeline).session(session);
  } else {
    aggregateResult = await model.aggregate(pipeline);
  }
  const response = aggregateResult.length > 0 ? aggregateResult[0].data : [];
  return response;
};
