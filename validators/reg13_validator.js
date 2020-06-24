/**
 * Data model for form Reg13 based on SUKL docs!
 */
const Joi = require("@hapi/Joi");

exports.head = Joi.object({
  podaniID: Joi.string().required(),
  obdobi: Joi.string()
    .pattern(new RegExp(/^20[0-9]\d(0[1-9]|1[0-2])$/))
    .required(),
  kodPracoviste: Joi.string()
    .pattern(new RegExp(/\d{11}$/))
    .required(),
  sw: {
    nazev: Joi.string().min(1).max(100).required(),
    verze: Joi.string().min(1).max(20).required(),
    vyrobce: Joi.string().min(1).max(100).required(),
  },
  reglp: Joi.array(),
  nereglp: Joi.array(),
});

exports.reglp = Joi.object({
  polozkaID: Joi.string().required(),
  typHlaseni: Joi.number().valid(1, 2).required(),
  typPohybu: Joi.number().valid(1, 2).required(),
  mnozstvi: Joi.number().min(1).max(999999999).required(),
  nazev: Joi.string().min(1).max(100).required(),
  sarze: Joi.string().min(1).max(20).required(),
  kodSUKL: Joi.string()
    .pattern(new RegExp(/^([0-9]{7,7})$/))
    .required(),
  cena: Joi.number().min(0).max(99999999.99).required(),
});

const validData = (data) => {
  return schema.validate(data);
};
