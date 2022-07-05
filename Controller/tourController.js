const fs = require('fs');
const Tour = require('../Models/tourModel');

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`
  )
);

exports.checkID = (req, res, next, val) => {
  if (val * 1 >= tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!(req.body.name && req.body.price)) {
    return res.status(400).json({
      status: 'Fail',
      message: 'Missing name or price',
    });
  }
  next();
};
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((item) => item.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.addNewTour = (req, res) => {
  const newid = tours[tours.length - 1].id + 1;
  const newTour = {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    ...req.body,
    id: newid,
  };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Updated',
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).send(null);
};
