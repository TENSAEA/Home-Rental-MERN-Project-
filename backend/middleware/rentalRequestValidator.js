const Joi = require("joi");

const rentalRequestValidator = Joi.object({
  house: Joi.string().required().messages({
    "any.required": "House ID is required",
  }),
  tenant: Joi.string().required().messages({
    "any.required": "Renter ID is required",
  }),
  startDate: Joi.date().required().messages({
    "any.required": "Start date is required",
    "date.base": "Start date must be a valid date",
  }),
  endDate: Joi.date().required().messages({
    "any.required": "End date is required",
    "date.base": "End date must be a valid date",
  }),
  status: Joi.string()
    .valid("pending", "approved", "rejected")
    .default("pending")
    .messages({
      "any.only": "Invalid status",
    }),
});
module.exports = rentalRequestValidator;
