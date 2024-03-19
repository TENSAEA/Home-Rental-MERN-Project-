const Joi = require("joi");

const houseSchema = Joi.object({
  owner: Joi.string().required(),
  city: Joi.string().required().messages({
    "any.required": "City is required.",
    "string.empty": "City cannot be empty.",
  }),
  subCity: Joi.string().required().messages({
    "any.required": "Sub city is required.",
    "string.empty": "Sub city cannot be empty.",
  }),
  wereda: Joi.string().required().messages({
    "any.required": "Wereda is required.",
    "string.empty": "Wereda cannot be empty.",
  }),
  specialLocation: Joi.string().required().messages({
    "any.required": "Special location is required.",
    "string.empty": "Special location cannot be empty.",
  }),
  type: Joi.string()
    .valid(
      "OneBedroom",
      "TwoBedroom",
      "ThreeBedroom",
      "Studio",
      "G+1",
      "G+2",
      "G+3"
    )
    .required()
    .messages({
      "any.required": "Type is required.",
      "string.empty": "Type cannot be empty.",
      "any.only":
        "Type must be one of: OneBedroom, TwoBedroom, ThreeBedroom, Studio, G+1, G+2, G+3.",
    }),
  category: Joi.string()
    .valid(
      "House",
      "Apartment",
      "Condominium",
      "Service",
      "Penthouse",
      "others"
    )
    .required()
    .messages({
      "any.required": "Category is required.",
      "string.empty": "Category cannot be empty.",
      "any.only":
        "Category must be one of: House, Apartment, Condominium, Service, Penthouse, others.",
    }),
  price: Joi.number().required().messages({
    "any.required": "Price is required.",
    "number.base": "Price must be a number.",
  }),
  comision: Joi.number().default(null),
  description: Joi.string().required().messages({
    "any.required": "Description is required.",
    "string.empty": "Description cannot be empty.",
  }),
  photos: Joi.array().items(Joi.string()),
  active: Joi.boolean().default(true),
  status: Joi.string()
    .valid("available", "rented", "unavailable")
    .default("available"),
  approvalStatus: Joi.string()
    .valid("pending", "approved", "declined")
    .default("pending"),
});

module.exports = houseSchema;
