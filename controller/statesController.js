const fs = require("fs");
const States = require("../model/States");

const GetAllStates = async (req, res) => {
    try {
        const jsonStates = JSON.parse(fs.readFileSync("data/states.json", "utf8"));
        const dbStates = await States.find();
        const mergedStates = [...jsonStates, ...dbStates];
        res.json(mergedStates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error"});
    }
};

const GetStateByCode = async (req, res) => {
    try {
        const jsonData = JSON.parse(fs.readFileSync("data/states.json", "utf8"));
        const dbState = await States.findOne({ stateCode: req.params.state.toUpperCase() }).exec();
        const jsonState = jsonData.find(state => state.stateCode === req.params.state.toUpperCase());
        if(!dbState && !jsonState) return res.status(404).json({ message: `No state matches with the code ${req.params.state}`});
        const mergedState = { ...(jsonState || {}), ...(dbState?.toObject() || {})};
        res.json(mergedState);
    } catch {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

module.exports = {
    GetAllStates,
    GetStateByCode
};