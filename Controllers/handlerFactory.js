const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/apiError");
const ApiFeatures = require("../Utils/apiFeatures");

exports.getAll = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;

    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .search(Model.collection.collectionName)
      .filter()
      .sort()
      .limitFields()
      .paginate(documentsCount);

    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery.populate(populationOpt);

    res.status(200).json({
      status: "success",
      pagination: paginationResult,
      results: documents.length,
      data: {
        documents,
      },
    });
  });

exports.getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populationOpt) query = query.populate(populationOpt);
    const document = await query;

    if (!document) {
      return next(new ApiError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        document,
      },
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);

    if (!document) {
      return next(new ApiError("Document is not Created", 404));
    }

    res.status(201).json({
      status: "success",
      data: {
        document,
      },
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new ApiError("No document found with that ID", 404));
    }
    await document.save();
    res.status(200).json({
      status: "success",
      data: {
        document,
      },
    });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(new ApiError("No document found with that ID", 404));
    }
    await document.deleteOne();
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
