const Payment = require('../Models/PaymentModel');
const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

//@desc     Create new payment
//@route    POST /api/v1/payments
//@access   Private
exports.createPayment = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    payment_amount,
    property_id,
    user_id,
    payment_method,
    payment_status,
  } = req.body;

  const payment = await Payment.create({
    payment_amount,
    property_id,
    user_id,
    payment_method,
    payment_status,
  });

  res.status(201).json({
    success: true,
    data: payment,
  });
});

//@desc     Get payment by id
//@route    GET /api/v1/payments/:id
//@access   Private
exports.getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id).populate('user', [
    'name',
    'email',
  ]);

  if (!payment) {
    return res.status(404).json({
      success: false,
      error: 'Payment not found',
    });
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
});

//@desc     Update payment by id
//@route    PUT /api/v1/payments/:id
//@access   Private
exports.updatePayment = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      error: 'Payment not found',
    });
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
});

//@desc     Delete payment by id
//@route    DELETE /api/v1/payments/:id
//@access   Private
exports.deletePayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return res.status(404).json({
      success: false,
      error: 'Payment not found',
    });
  }

  await payment.remove();

  res.status(200).json({
    success: true,
    data: {},

  });
});

