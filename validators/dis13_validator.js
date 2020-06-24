/**
 * Data model for form Dis13 based on SUKL docs!
 * SUKL API version 7
 */
const Joi = require("@hapi/Joi");

const yearType = Joi.number().min(2000).max(2050).integer().required();
const monthType = Joi.number().min(1).max(12).integer().required();

const podaniIDType = Joi.string()
  .regex(
    /^([0-9A-Fa-f]{8,8}\-[0-9A-Fa-f]{4,4}\-[0-9A-Fa-f]{4,4}\-[0-9A-Fa-f]{4,4}\-[0-9A-Fa-f]{12,12})$/
  )
  .required();

const obdobiType = Joi.string()
  .pattern(new RegExp(/^20[0-9]\d(0[1-9]|1[0-2])$/))
  .required();

const kodPracovisteType = Joi.string() // TODO check this
  .pattern(new RegExp(/\d{11}$/))
  .required();

const reglp = Joi.object({
  polozkaID: Joi.string().required(),
  typHlaseni: Joi.number().valid(1, 2).required(),
  typPohybu: Joi.number().valid(1, 2).required(),
  mnozstvi: Joi.number().min(1).max(999999999).required(),
  nazev: Joi.string().min(1).max(100).required(),
  sarze: Joi.string().min(1).max(20).required(),
  kodSUKL: Joi.string()
    .regex(/^[0-9]{7,7}$/)
    .required(),
  cena: Joi.number().min(0).max(99999999.99).required(),
  typOdberatele: Joi.number().min(1).max(13).required(),
  // primaDodavkaLP: Joi.bool().required(), // TODO temporarily not as required!
  primaDodavkaLP: Joi.bool(),
});

const nereglp = Joi.object({
  polozkaID: Joi.string().required(),
  typHlaseni: Joi.number().valid(1, 2).required(),
  typPohybu: Joi.number().valid(1, 2).required(),
  typOdberatele: Joi.number().valid(2, 6, 11, 12, 13).required(),
  mnozstvi: Joi.number().min(1).max(999999999).required(),
  nazev: Joi.string().min(1).max(100).required(),
  sarze: Joi.string().min(1).max(20).required(),
  cena: Joi.number().min(0).max(99999999.99).required(),
  typLP: Joi.string().min(1).max(20).required(),
  doplnek: Joi.string().min(1).max(50).required(),
  vyrobce: Joi.string().min(1).max(100).required(),
  zeme: Joi.string().min(1).max(100).required(),
  obsah: Joi.string().min(1).max(500).required(),
  odberatel: Joi.string().min(1).max(100),
  ulice: Joi.string().min(1).max(48),
  cp: Joi.number().max(9999999),
  obec: Joi.string().min(1).max(48),
  psc: Joi.string().max(5),
});

const fullDis13 = Joi.object({
  podaniID: podaniIDType,
  obdobi: obdobiType,
  kodPracoviste: kodPracovisteType,
  sw: {
    nazev: Joi.string().min(1).max(100).required(),
    verze: Joi.string().min(1).max(20).required(),
    vyrobce: Joi.string().min(1).max(100).required(),
  },
  reglp: Joi.array().items(reglp),
  nereglp: Joi.array().items(nereglp),
});

module.exports = {
  yearType,
  monthType,
  podaniIDType,
  obdobiType,
  kodPracovisteType,
  reglp: reglp,
  nereglp: nereglp,
  fullDis13: fullDis13,
};
