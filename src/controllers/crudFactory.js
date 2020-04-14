const catchAsync = require('../errors/catchAsync');
const Errors = require('../errors/errorsClass');
const APIqueryFeatures = require('../utils/apiQueryFeatures');

const createOne = Model =>
  catchAsync(async (req, res, next) => {
    const createdDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        createdDoc
      }
    });
  });

const readAll = Model =>
  catchAsync(async (req, res, next) => {
    //Nested routes
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const { mongooseQuery } = new APIqueryFeatures(
      Model.find(filter),
      req.query
    )
      .filter()
      .sort()
      .pagination();
    const readDocs = await mongooseQuery;

    res.status(200).json({
      status: 'success',
      data: {
        readDocs
      }
    });
  });

const readOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const readDoc = await query;

    res.status(200).json({
      status: 'success',
      data: {
        readDoc
      }
    });
  });

const updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedDoc)
      return next(new Errors('Not document found to update!🎃', 404));

    res.status(200).json({
      status: 'success',
      data: {
        updatedDoc
      }
    });
  });

const deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const deletedDoc = await Model.findByIdAndDelete(req.params.id);

    if (!deletedDoc) {
      return next(
        new Errors(
          `Cannot delete non-existent item💥 - ${req.originalUrl}`,
          400
        )
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        deleted: deletedDoc
      }
    });
  });

module.exports = { createOne, readAll, readOne, updateOne, deleteOne };
