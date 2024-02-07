const constants = require("../helpers/constants");
const { Response } = require("../helpers/responseHandler");
const { createAggregationPipeline } = require("./aggregation");

exports.listCommonAggregationFilterize = async (
  req,
  res,
  model,
  createAggregationPipeline,
  customParams
) => {
  try {
    const { searchTerm, sortField, columnFilters, deleted } = req.query;
    let softRemove;
    // if (deleted) {
    //   softRemove = JSON.parse(deleted);
    // }
  
    let sortOrder = req.query?.sortOrder ? parseInt(req.query?.sortOrder) : -1;
    let columnFiltersArray = [];
    if (columnFilters) {
      columnFiltersArray = JSON.parse(columnFilters);
    }
    let limit = req.query?.limit ? parseInt(req.query?.limit) : 20;
    let page = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1;
    let skip = (page - 1) * limit;
    const pipeline = createAggregationPipeline({
      skip,
      limit,
      searchTerm,
      sortField: sortField ? sortField : "createdAt",
      sortOrder: sortOrder ? sortOrder : 1,
      columnFilters: columnFiltersArray,
      deleted:deleted,
      customParams,
    });
    // @ts-ignore
    const result = await model.aggregate(pipeline);

    const total = result.length > 0 ? result[0].total : 0;
    const data = result.length > 0 ? result[0].data : [];

    Response(res, 200, "ok", data, total);
  } catch (error) {
    console.log(model.modelName, error);
    Response(res, 400, constants.GET_ERROR);
  }
};

exports.listAggregation = async (
  req,
  res,
  model,
  createAggregationPipeline,
  customParams
) => {
  try {
    const { searchTerm, sortField, columnFilters, deleted } = req.query;
    let sortOrder = req.query?.sortOrder ? parseInt(req.query?.sortOrder) : -1;
    let columnFiltersArray = [];
    if (columnFilters) {
      columnFiltersArray = JSON.parse(columnFilters);
    }
    let limit = req.query?.limit ? parseInt(req.query?.limit) : 20;
    let page = req.query?.pageNumber ? parseInt(req.query?.pageNumber) : 1;
    let skip = (page - 1) * limit;
    const pipeline = createAggregationPipeline({
      skip,
      limit,
      searchTerm,
      sortField: sortField ? sortField : "createdAt",
      sortOrder: sortOrder ? sortOrder : 1,
      columnFilters: columnFiltersArray,
      deleted,
      customParams,
    });
    // @ts-ignore
    const result = await model.aggregate(pipeline);

    const total = result.length > 0 ? result[0].total : 0;
    const data = result.length > 0 ? result[0].data : [];

    return { total, data };
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
 * @returns {Promise<Object>}
 */

exports.aggregationByIds = async ({
  model,
  ids,
  customParams,
  ownPipeline,
}) => {
  const document = ids && ids?.length ? ids : [ids];
  let pipeline;
  if (customParams) {
    // @ts-ignore
    pipeline = createAggregationPipeline({ ids: document, customParams });
  } else if (ownPipeline) {
    // @ts-ignore
    pipeline = ownPipeline({ ids: document });
  }

  // @ts-ignore
  const aggregateResult = await model.aggregate(pipeline);
  const response = aggregateResult.length > 0 ? aggregateResult[0].data : [];
  return response;
};
