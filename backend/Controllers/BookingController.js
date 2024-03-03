const Booking = require('../Models/BookingModel');
const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

//@desc     Create new booking
//@route    POST /api/v1/bookings
//@access   Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    check_in,
    check_out,
    property_id,
    user_id,
    amount,
    payment_status,
    status,
  } = req.body;

  const booking = await Booking.create({
    check_in,
    check_out,
    property_id,
    user_id,
    amount,
    payment_status,
    status,
  });

  res.status(201).json({
    success: true,
    data: booking,
  });
});

//@desc     Get booking by id
//@route    GET /api/v1/bookings/:id
//@access   Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate('user', [
    'name',
    'email',
  ]);

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found',
    });
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

//@desc     Get all bookings
//@route    GET /api/v1/bookings
//@access   Private
exports.getBookings = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc     Update booking by id
//@route    PUT /api/v1/bookings/:id
//@access   Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found',
    });
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

//@desc     Delete booking by id
//@route    DELETE /api/v1/bookings/:id
//@access   Private
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found',
    });
  }

  await booking.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
