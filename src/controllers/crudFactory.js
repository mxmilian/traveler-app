const catchAsync = require('../errors/catchAsync');
const Errors = require('../errors/errorsClass');

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

module.exports = { createOne, updateOne, deleteOne };
