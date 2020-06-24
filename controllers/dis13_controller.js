const logger = require("../logger");
const scripts = require("../scripts");
const validators = require("../validators");

const Joi = require("@hapi/Joi");
const router = require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
}).single("report");
const uuid = require("uuid");

router.get("/", (req, res) => {
  return res.send("Welcome to the Dis13 API controller");
});

// Return available scripts for file parsing
router.get("/scripts", (req, res) => {
  return res.send(Object.keys(scripts));
});

const loadFile = (req) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(req.file.buffer);
    } catch {
      reject(new Error('Couldn\'t read the file. Check the "report" field'));
    }
  });
};

const returnParser = (req) => {
  return new Promise((resolve, reject) => {
    if (Object.keys(scripts).includes(req.body.script)) {
      resolve(scripts[req.body.script]);
    } else {
      reject(new Error(`Non-existenting script parser: ${req.body.script}`));
    }
  });
};

router.post("/parsereport", upload, async (req, res, next) => {
  try {
    // TODO del after a while...
    // const reportID = await validators.validate(
    //   req.body.report_id,
    //   validators.dis13.podaniIDType
    // );
    // const workplaceID = await validators.validate(
    //   req.body.workplace_id,
    //   validators.dis13.kodPracovisteType
    // );
    // const period = await validators.validate(
    //   req.body.period,
    //   validators.dis13.obdobiType
    // );
    const buffFile = await loadFile(req);
    const parser = await returnParser(req);

    parser.main(buffFile).then((parsed) => {
      logger.debug(`Form Dis13 parsed with script ${req.body.script}`);
      res.send(parsed);
    });
  } catch (err) {
    return next(err);
  }
});

// TODO OBSOLETE
// router.post("/uploadreport", (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err) {
//       next(err);
//     } else {
//       try {
//         // Validate or generate new report ID (UUIDv4)
//         let report_id;
//         if (req.body.report_id) {
//           report_id = req.body.report_id;
//         } else {
//           report_id = String(uuid.v4());
//         }
//         console.log("reportID:", report_id);
//         Joi.attempt(
//           report_id,
//           validators.dis13.podaniIDType,
//           "Invalid report_id format:"
//         );
//         // Validate file
//         if (!req.file) {
//           throw new Error("Missing file in Dis13 upload form");
//         }
//         const bufferedFile = req.file.buffer;

//         // Check whether script (to parse uploaded file with) exists
//         const scriptName = req.body.script;
//         if (!Object.keys(scripts).includes(scriptName)) {
//           throw new Error(
//             `File parse script ${scriptName} not found in existing scripts`
//           );
//         }
//         const script = scripts[scriptName];

//         // Validate period value (SUKL docs)
//         const period = req.body.period;
//         Joi.attempt(
//           period,
//           validators.dis13.obdobiType,
//           "Invalid period format:"
//         );

//         // Validate workplaceID/pracovisteID (SUKL docs)
//         const workplaceId = req.body.workplace_id;
//         Joi.attempt(
//           workplaceId,
//           validators.dis13.kodPracovisteType,
//           "Invalid WorkplaceID format"
//         );

//         // Parse and validate input file and return JSON format
//         script.main(bufferedFile).then((scriptOutput) => {
//           logger.debug(`Form Dis13 parsed with script ${scriptName}`);
//           res.send(scriptOutput);
//         });
//       } catch (err) {
//         next(err, (err.statusCode = 400));
//       }
//     }
//   });
// });

module.exports = router;
