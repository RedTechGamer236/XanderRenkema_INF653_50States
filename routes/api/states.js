const express = require("express");
const router = express.Router();
const statesController = require("../../controller/statesController");

router.route("/").get(statesController.GetAllStates);

router.route("/:state").get(statesController.GetStateByCode);

module.exports = router;