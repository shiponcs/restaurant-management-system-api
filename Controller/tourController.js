const Tour = require('../Models/tourModel');
const ApiError = require('../utility/apiError');
const ApiFeatures = require('../utility/apiFeatures');
const catchAsync = require('../utility/catchAsync');

exports.aliasCheapTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields =
    'name, price, summery, ratingsAverage, difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // Query
  const tourQuery = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .selectFields()
    .pagination();
  // Execute query
  const tours = await tourQuery.query;
  // Send Response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(
      new ApiError('No tour found with that ID', 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.addNewTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create({
    ...req.body,
  });
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedTour) {
    return next(
      new ApiError('No tour found with that ID', 404)
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      updatedTour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(
    req.params.id
  );
  if (!deletedTour) {
    return next(
      new ApiError('No tour found with that ID', 404)
    );
  }
  res.status(204).send(null);
});

exports.tourStatistics = catchAsync(
  async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avrRating: { $avg: '$ratingsAverage' },
          avrPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: -1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  }
);

exports.monthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
