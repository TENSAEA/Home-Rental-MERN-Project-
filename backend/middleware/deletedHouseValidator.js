const Joi = require("joi");

const deletionReasons = [
  "LANDLORD_UNAVAILABLE",
  "DUPLICATE_LISTING",
  "INCORRECT_INFORMATION",
  "BROKER_CONTRACT_EXPIRED",
  "LANDLORD_TERMINATED_CONTRACT",
  "HOUSE_ALREADY_RENTED",
  "ADMIN_FRAUDULENT_LISTING",
  "ADMIN_POLICY_VIOLATION",
  "ADMIN_DATA_INCONSISTENCY",
  "SUPERADMIN_MAINTENANCE",
  "SUPERADMIN_LEGAL_ISSUES",
  "SUPERADMIN_PLATFORM_CLOSURE",
];

const deletedHouseValidator = Joi.object({
  deletionReason: Joi.string()
    .valid(...deletionReasons)
    .required()
    .messages({
      "any.required": "Deletion reason is required",
      "any.only": "Invalid deletion reason",
    }),
});

module.exports = deletedHouseValidator;
