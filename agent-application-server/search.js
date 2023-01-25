/* eslint-disable camelcase */
const router = require('express').Router();

// TODO: update to require in the custom valorant API module
const valorant = require('valorant-api');

// helper functions for printing
const _formatResults = (selectedAgent) => {
    const formatResults = {
        displayText: "Class: " + selectedAgent.role.displayName + " - " + "Name: " + selectedAgent.displayName,
        id: selectedAgent.uuid,
    }
    return formatResults;
}

const _agentSelections = async (valAgents, agentClass) => {
    const agents = [];
    // console.log(agentClass)
    for(let i of valAgents){
        if(i.isPlayableCharacter === true && i.role.displayName === agentClass){
            agents.push(i);
        }
    }

    return agents;
};

// GET /search/agents
// accepts a query params as ?keyword=Duelist
router.get('/agents', async (req, res) => {
    try{
        // ?keyword=Duelist 
        const { keyword } = req.query;

        // console.log(`${keyword[0].toUpperCase()}${keyword.substring(1)}`);

        // Key that gets sent to the API to retrieve only agents.
        const agents = 'agents';

        // gets the whole Valorant Agents
        const valAgents = await valorant.buildAgentCollection(agents);
       
        // condenses the data and lists only the agents based on the selected 'agentClass'
        const specificAgent = await _agentSelections(valAgents.data, `${keyword[0].toUpperCase()}${keyword.substring(1)}`);
        
        // Testing to see if I get the collection of <specifiedAgent>
        // console.log(specificAgent)

        // compose the JSON response
        const data = {
            counter: specificAgent.length,
            results: []
        }
        
        // Adding all the results to the 'results' above.
        for(let i of specificAgent) {
            const result = _formatResults(i);

            data.results.push(result);
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// Post /search/agents/details
router.post('/agents/details', async (req, res) => {
    try{
        // destructure the POST body
        const { selectedId, selectedText, keyword} = req.body;
        const { count } = req.body;

        // Key that gets sent to the API to retrieve only agents.
        const agents = 'agents';

        const id_agent = `${selectedId}`;

        const agent = await valorant.buildSpecificAgent(agents, id_agent);

        // compose the JSON response        
        const data = agent.data;

        // For the timestamp
        const date = new Date().toString();

        // compose the data for MongoDB
        const results = {
            count: count,
            keyword: keyword,
            selectedId: selectedId,
            selectedText: selectedText,
            timestamp: date
        }

        // insert the results into MongoDB
        const db = req.app.locals.db;
        const collection = db.collection('History')

        await collection.insertOne(results);
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
