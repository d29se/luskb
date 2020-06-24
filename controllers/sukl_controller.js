const logger = require("../logger");
const services = require("../services");

const router = require("express").Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

// GET root
router.get("/", (req, res) => {
  return res.send("Welcome to SUKL API main URL");
});

// CREATE new report
router.post("/dis13v7", jsonParser, async (req, res, next) => {
  await services.suklApiProxy.dis13v7
    .postReport(req.body)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      try {
        err.statusCode = err.response.status;
        err.message = err.response.data.popisChyby;
        err.source = "SUKL";
      } catch {}
      next(err);
    });
});

// DELETE report
router.delete("/dis13v7", jsonParser, async (req, res, next) => {
  await services.suklApiProxy.dis13v7
    .delReport(req.body.report_id)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      try {
        err.statusCode = err.response.status;
        err.message = err.response.data.popisChyby;
        err.source = "SUKL";
      } catch {}
      next(err);
    });
});

// GET report
router.get("/dis13v7", jsonParser, async (req, res, next) => {
  await services.suklApiProxy.dis13v7
    .getReport(req.body.report_id)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      try {
        err.statusCode = err.response.status;
        err.message = err.response.data.popisChyby;
        err.source = "SUKL";
      } catch {}
      next(err);
    });
});

// CHANGE report
router.put("/dis13v7", jsonParser, async (req, res, next) => {
  await services.suklApiProxy.dis13v7
    .putReport(req.body.podaniID, req.body) // UUID from the report, report itself
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      try {
        err.statusCode = err.response.status;
        err.message = err.response.data.popisChyby;
        err.source = "SUKL";
      } catch {}
      next(err);
    });
});

// DELETE report item
router.delete("/dis13v7/deleteitem", jsonParser, async (req, res, next) => {
  await services.suklApiProxy.dis13v7
    .delReportItem(req.body.report_id, req.body.item_id)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      try {
        err.statusCode = err.response.status;
        err.message = err.response.data.popisChyby;
        err.source = "SUKL";
      } catch {}
      next(err);
    });
});

// CHANGE report item
router.put("/dis13v7/updateitem", jsonParser, async (req, res, next) => {
  // item_id is not taken as ID by SUKL API! It doesn't matter what it is, but UUID format!
  // Item UUID has to remain the same. Otherwise, item is added as new (not updated)
  await services.suklApiProxy.dis13v7
    .putReportItem(
      req.body.new_item_data.podaniID,
      req.body.item_id,
      req.body.new_item_data
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      try {
        err.statusCode = err.response.status;
        err.message = err.response.data.popisChyby;
        err.source = "SUKL";
      } catch {}
      next(err);
    });
});

// GET report ID
router.get("/dis13v7/getreportid", jsonParser, async (req, res, next) => {
  await services.suklApiProxy.dis13v7
    .getReportID(req.body.workplace_id, req.body.year, req.body.month)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      try {
        err.statusCode = err.response.status;
        err.message = err.response.data.popisChyby;
        err.source = "SUKL";
      } catch {}
      next(err);
    });
});

module.exports = router;
