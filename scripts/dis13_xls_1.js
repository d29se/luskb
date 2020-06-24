/**
 * Data parser for form Dis13 from uploaded excel to json
 * Variant 1
 */

const xlsx = require("xlsx");
const prepend0 = require("./parse_helpers").prepend0;
const models = require("../validators/index");
const uuid = require("uuid");

const inputFileModel = {
  POLOZKA_ID: "polozkaID",
  TYP_HLASENI: "typHlaseni",
  TYP_POHYBU_LP: "typPohybu",
  MNOZSTVI: "mnozstvi",
  NAZEV: "nazev",
  SARZE: "sarze",
  KOD_SUKL: "kodSUKL",
  CENA_PUVODCE: "cena",
  TYP_ODBERATELE: "typOdberatele",
};

const rowRefactor = (row) => {
  return new Promise((resolve, reject) => {
    let newRow = {};
    for (let [key, value] of Object.entries(row)) {
      if (key in inputFileModel) {
        if (key === "KOD_SUKL") value = String(prepend0(value));
        newRow[inputFileModel[key]] = String(value);
      }
    }
    newRow ? resolve(newRow) : reject(row);
  });
};

const validateRow = (row) => {
  return new Promise((resolve) => {
    const u4id = uuid.v4;
    const { error, value } = models.dis13.reglp.validate(row);
    if (error) {
      resolve({
        uuid: u4id,
        valid: false,
        errMsg: error.message,
        rowData: error._original,
      });
    } else {
      resolve({
        uuid: u4id,
        valid: true,
        errMsg: "No errors found",
        rowData: value,
      });
    }
  });
};

const pars = async (inputFile, cb) => {
  workbook = xlsx.read(inputFile);
  wbSheetList = workbook.SheetNames;
  jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[wbSheetList[0]], {
    defval: "",
  });
  newData = [];

  for (let index = 0; index < jsonData.length; index++) {
    element = jsonData[index];
    refRow = await rowRefactor(element);
    validatedRow = await validateRow(refRow);
    // console.log(validatedRow);
    newData.push(validatedRow);
  }
  return newData;
};

exports.main = async (inputFile) => {
  return await pars(inputFile);
};
