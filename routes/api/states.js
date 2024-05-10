const express = require("express");
const router = express.Router();
const statesController = require("../../controller/statesController");

router.route("/").get(statesController.GetAllStates);

router.route("/:state").get(statesController.GetStateByCode);
router.route("/:state/funfact").get(statesController.GetFunFact)
.post(statesController.AddNewFunFact)
.patch(statesController.ReplaceFunFact)
.delete(statesController.DeleteFunFact);
router.route("/:state/capital").get(statesController.GetCapital);
router.route("/:state/nickname").get(statesController.GetNickname);
router.route("/:state/population").get(statesController.GetPopulation);
router.route("/:state/admission").get(statesController.GetAdmission);

module.exports = router;