const config = require("../../config");
const logger = require("../../logger");
const validators = require("../../validators");

const https = require("https");
const axios = require("axios");
const fs = require("fs");
const { response } = require("express");
const api = axios.create({
  baseURL: "https://testapi.sukl.cz/dis13/v7",
  httpsAgent: new https.Agent({
    pfx: fs.readFileSync("./secure/sukl/DISSUKL150023753G.pfx"),
    // TODO Move cert passphrase to the database
    passphrase: config.CERT_PASSPHRASE,
  }),
  timeout: 10000,
});

// TODO OBSOLETE
// const handleSuklError = (error, callback) => {
//   let logdata = {
//     connectionTimeout: false,
//     data: "No response data",
//     status: 400,
//     statusText: "No status data",
//     headers: "No headers data",
//     // logdata.request = error.response.request, // TODO Cyclic dependency detected
//     // logdata.config = error.response.config, // TODO BSON Serialize error
//     dblogid: "No database id",
//   };

//   if (error.response) {
//     logdata.data = error.response.data;
//     logdata.status = error.response.status;
//     logdata.statusText = error.response.statusText;
//     logdata.headers = error.response.headers;
//   } else if (error.code === "ECONNABORTED") {
//     logdata.connectionTimeout = true;
//     logdata.status = 408;
//   }

//   callback(logdata);
// };

const certName = config.CERT_NAME;
const certPass = config.CERT_PASSPHRASE;

// const validateInput = (data, schema) => {
//   return new Promise((resolve, reject) => {
//     const { error, value } = schema.validate(data);
//     if (error) {
//       reject(error);
//     } else resolve(value);
//   });
// };

const loadCertPfx = (certName) => {
  const certDir = "./secure/sukl/";
  return new Promise((resolve, reject) => {
    fs.readFile(certDir + certName, (err, data) => {
      if (err) {
        reject(err);
      } else resolve(data);
    });
  });
};

const getAxiosConfig = (method, url, certFile, certPass, data) => {
  return Promise.resolve({
    method: method,
    baseURL: "https://testapi.sukl.cz/dis13/v7",
    url: url,
    data: data,
    timeout: 10000,

    httpsAgent: new https.Agent({
      pfx: certFile,
      passphrase: certPass,
    }),
  });
};

// CREATE new report
exports.postReport = async (reportData) => {
  const method = "POST";
  const reportDataSchema = validators.dis13.fullDis13;

  await validators.validate(reportData, reportDataSchema);

  const certFile = await loadCertPfx(certName);
  const url = "/hlaseni/";
  const axiosConfig = await getAxiosConfig(
    method,
    url,
    certFile,
    certPass,
    reportData
  );

  return await axios(axiosConfig);
};

// DELETE report
exports.delReport = async (reportID) => {
  const method = "DELETE";
  const reportIDSchema = validators.dis13.podaniIDType;

  await validators.validate(reportID, reportIDSchema);

  const certFile = await loadCertPfx(certName);
  const url = `/hlaseni/${reportID}`;
  const axiosConfig = await getAxiosConfig(method, url, certFile, certPass);

  return await axios(axiosConfig);
};

// GET report
exports.getReport = async (reportID) => {
  const method = "GET";
  const reportIDSchema = validators.dis13.podaniIDType;

  await validators.validate(reportID, reportIDSchema);

  const certFile = await loadCertPfx(certName);
  const url = `/hlaseni/${reportID}`;
  const axiosConfig = await getAxiosConfig(method, url, certFile, certPass);

  return await axios(axiosConfig);
};

// CHANGE report
// Complete replacement of the original report
exports.putReport = async (reportID, reportData) => {
  const method = "PUT";
  const reportIDSchema = validators.dis13.podaniIDType;
  const reportDataSchema = validators.dis13.fullDis13;

  await validators.validate(reportID, reportIDSchema);
  await validators.validate(reportData, reportDataSchema);

  const certFile = await loadCertPfx(certName);
  const url = `/hlaseni/${reportID}`;
  const axiosConfig = await getAxiosConfig(
    method,
    url,
    certFile,
    certPass,
    reportData
  );

  return await axios(axiosConfig);
};

// DELETE report item
exports.delReportItem = async (reportID, itemID) => {
  const method = "DELETE";
  const reportIDSchema = validators.dis13.podaniIDType;

  await validators.validate(reportID, reportIDSchema);
  await validators.validate(itemID, reportIDSchema); // ItemID is UUID as well

  const certFile = await loadCertPfx(certName);
  const url = `/hlaseni/${reportID}/polozky/${itemID}`;
  const axiosConfig = await getAxiosConfig(method, url, certFile, certPass);

  return await axios(axiosConfig);
};

// CHANGE report item
// Change or add particular item in the report. If the item ID in the array
// of items is different then original, it will be added
exports.putReportItem = async (reportID, itemID, singleItemData) => {
  const method = "PUT";
  const reportIDSchema = validators.dis13.podaniIDType;
  const reportDataSchema = validators.dis13.fullDis13;

  await validators.validate(reportID, reportIDSchema);
  await validators.validate(itemID, reportIDSchema); // ItemID is UUID as well
  await validators.validate(singleItemData, reportDataSchema); // Single item has the same format as full report

  const certFile = await loadCertPfx(certName);
  const url = `/hlaseni/${reportID}/polozky/${itemID}`;
  const axiosConfig = await getAxiosConfig(
    method,
    url,
    certFile,
    certPass,
    singleItemData
  );

  return await axios(axiosConfig);
};

// GET report ID
// ... for the specific year and month. This is the only option.
// It's not possible to aggregate the request eg. for whole year!
// Returns status 200 and UUID in array or empty array
exports.getReportID = async (workplaceID, year, month) => {
  const method = "GET";
  const workplaceIDSchema = validators.dis13.kodPracovisteType;
  const yearSchema = validators.dis13.yearType;
  const monthSchema = validators.dis13.monthType;

  await validators.validate(workplaceID, workplaceIDSchema);
  await validators.validate(year, yearSchema);
  await validators.validate(month, monthSchema);

  const certFile = await loadCertPfx(certName);
  const url = `/hlaseni/${workplaceID}/rok/${year}/mesic/${month}`;
  const axiosConfig = await getAxiosConfig(method, url, certFile, certPass);

  return await axios(axiosConfig);
};

const yearlyReportsConfigs = async (year, workplace_id) => {
  const axiosReqPromises = [];
  const method = "GET";
  const certFile = await loadCertPfx(certName);
  const currentMonth = new Date().getMonth() + 1;

  for (let month = 1; month <= currentMonth; month++) {
    let url = `https://testapi.sukl.cz/dis13/v7/hlaseni/${workplace_id}/rok/${year}/mesic/${month}`;
    let axiosConfig = await getAxiosConfig(method, url, certFile, certPass);
    axiosReqPromises.push(axios(axiosConfig));
  }
  return axiosReqPromises;
};
const deconstructResponses = (responseList) => {
  return responseList.map((reponseObj) => {
    return {
      report_id: reponseObj.data[0] ? reponseObj.data[0] : "",
      url: reponseObj.config.url,
      status: reponseObj.status,
      month: reponseObj.config.url.slice(-1),
    };
  });
};
exports.getReportForYear = (year, workplace_id) => {
  return yearlyReportsConfigs(year, workplace_id)
    .then((promiseList) => Promise.all(promiseList))
    .then((responses) => deconstructResponses(responses))
    .catch((err) => console.log("getReportForYear", err));
};
