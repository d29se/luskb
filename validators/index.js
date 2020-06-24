const dis13 = require("./dis13_validator");
const reg13 = require("./reg13_validator");

const validate = (data, schema) => {
  return new Promise((resolve, reject) => {
    const { error, value } = schema.validate(data);
    if (error) {
      reject(error);
    } else resolve(value);
  });
};

module.exports = {
  dis13: dis13,
  reg13: reg13,
  validate: validate,
};
