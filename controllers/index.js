const router = require("express").Router();
const sukl = require("./sukl_controller");
const dis13 = require("./dis13_controller");

router.get("/", (req, res) => {
  res.send("Welcome to the luskb API controller");
});

router.use("/sukl", sukl);
router.use("/dis13", dis13);

module.exports = router;
