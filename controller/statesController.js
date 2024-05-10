const fs = require("fs");
const States = require("../model/States");

// Function to generate a random integer between min and max (inclusive)
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to get a random fun fact from the provided fun facts array
const getRandomFunFact = (funfacts) => {
    if (!funfacts || funfacts.length === 0) {
        return null;
    }
    const randomIndex = getRandomInt(0, funfacts.length - 1);
    return funfacts[randomIndex];
};

const getState = async (stateCode) => {
    try {
        const jsonData = JSON.parse(fs.readFileSync("data/states.json", "utf8"));
        const dbState = await States.findOne({ stateCode: stateCode }).lean();
        const jsonState = jsonData.find(state => state.stateCode === stateCode);
        if (!dbState && !jsonState) throw new Error(`No state matches with the code ${stateCode}`);
        const mergedState = { ...(jsonState || {}), ...(dbState || {}) };
        return mergedState;
    } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error");
    }
}

const GetAllStates = async (req, res) => {
    try {
        const dbStates = await States.find({}, { _id: 0 }).lean();
        let mergedStates = []; // Initialize mergedStates array
        // Use Promise.all to await all getState calls concurrently
        mergedStates = await Promise.all(dbStates.map(dbState => getState(dbState.stateCode)));
        // Check if there's a query parameter named 'contig' in the request
        const contig = req.query.contig;
        if (contig) {
            // Filter the merged states based on the contig query parameter
            mergedStates = mergedStates.filter(state => state.someProperty === contig);
        }
        res.json(mergedStates);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const GetStateByCode = async (req, res) => {
    try {
        const stateData = await getState(req.params.state.toUpperCase());
        res.json(stateData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const GetFunFact = async (req, res) => {
    try {
        const jsonData = JSON.parse(fs.readFileSync("data/states.json", "utf8"));
        const dbState = await States.findOne({ stateCode: req.params.state.toUpperCase() }, {_id: 0}).lean();
        const jsonState = jsonData.find(state => state.stateCode === req.params.state.toUpperCase());
        if(!dbState && !jsonState) return res.status(404).json({ message: `No state matches with the code ${req.params.state}`});
        const mergedState = { ...(jsonState || {}), ...(dbState || {})};
        const funFact = getRandomFunFact(mergedState.funFacts);
        if(funFact === null) return res.status(404).json({ message: "No fun facts found"});
        res.json(funFact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

const AddNewFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();
        const funFacts = req.body.funFacts;

        if (!Array.isArray(funFacts) || funFacts.length === 0) {
            return res.status(400).json({ message: "Invalid or empty funfacts array" });
        }

        const state = await States.findOne({ stateCode: stateCode });
        if(!state) return res.status(400).json({ message: `No state matches with ID ${stateCode}`});

        state.funFacts.push(...funFacts);

        const result = await state.save();

        res.json(result);
    } catch (error) {
        console.error("Error adding fun facts: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const ReplaceFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();
        const funFact = req.body.funFact;
        const index = req.body.index;

        const state = await States.findOne({ stateCode: stateCode });
        if(!state) return res.status(400).json({ message: `No state matches with ID ${stateCode}`});

        state.funFacts[index - 1] = funFact;

        const result = await state.save();

        res.json(result);
    } catch (error) {
        console.error("Error adding fun facts: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const DeleteFunFact = async (req, res) => {
    try {
        const stateCode = req.params.state.toUpperCase();
        const index = req.body.index;

        const state = await States.findOne({ stateCode: stateCode });
        if(!state) return res.status(400).json({ message: `No state matches with ID ${stateCode}`});

        state.funFacts.splice(index - 1, 1);

        const result = await state.save();

        res.json(result);
    } catch (error) {
        console.error("Error adding fun facts: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const GetCapital = async(req, res) => {
    try {
        const jsonData = JSON.parse(fs.readFileSync("data/states.json", "utf8"));
        const jsonState = jsonData.find(state => state.stateCode === req.params.state.toUpperCase());
        if(!jsonState) return res.status(404).json({ message: `No state matches with the code ${req.params.state}`});
        // Extract only the name and capital fields from the state object
        const { state, capital_city } = jsonState;

        // Create a new object with only the name and capital fields
        const responseObj = { 'state': state, 'capital': capital_city };

        res.json(responseObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

const GetNickname = async(req, res) => {
    try {
        const jsonData = JSON.parse(fs.readFileSync("data/states.json", "utf8"));
        const jsonState = jsonData.find(state => state.stateCode === req.params.state.toUpperCase());
        if(!jsonState) return res.status(404).json({ message: `No state matches with the code ${req.params.state}`});
        // Extract only the name and capital fields from the state object
        const { state, nickname } = jsonState;

        // Create a new object with only the name and capital fields
        const responseObj = { 'state': state, 'nickname': nickname };

        res.json(responseObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

const GetPopulation = async(req, res) => {
    try {
        const jsonData = JSON.parse(fs.readFileSync("data/states.json", "utf8"));
        const jsonState = jsonData.find(state => state.stateCode === req.params.state.toUpperCase());
        if(!jsonState) return res.status(404).json({ message: `No state matches with the code ${req.params.state}`});
        // Extract only the name and capital fields from the state object
        const { state, population } = jsonState;

        // Create a new object with only the name and capital fields
        const responseObj = { 'state': state, 'population': population };

        res.json(responseObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

const GetAdmission = async(req, res) => {
    try {
        const jsonData = JSON.parse(fs.readFileSync("data/states.json", "utf8"));
        const jsonState = jsonData.find(state => state.stateCode === req.params.state.toUpperCase());
        if(!jsonState) return res.status(404).json({ message: `No state matches with the code ${req.params.state}`});
        // Extract only the name and capital fields from the state object
        const { state, admission_date } = jsonState;

        // Create a new object with only the name and capital fields
        const responseObj = { 'state': state, 'admitted': admission_date };

        res.json(responseObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

module.exports = {
    GetAllStates,
    GetStateByCode,
    GetFunFact,
    GetCapital,
    GetNickname,
    GetPopulation,
    GetAdmission,
    AddNewFunFact,
    ReplaceFunFact,
    DeleteFunFact
};