const superagent = require('superagent');

// a config file to hold our base URL (or any applicable API keys or authentication)
const config = require('./config.json');

const buildAgentCollection = async (a) => {
    try {
        const agentsURL = `${config.url}/${a}`;
        const response = await superagent.get(agentsURL);

        return response.body;
    } catch (error) {
        return error;
    }
};

const buildSpecificAgent = async (a, agent_id) => {
    try {
        const playableAgentsURL = `${config.url}/${a}/${agent_id}`;
        const response = await superagent.get(playableAgentsURL);

        return response.body;
    } catch (error) {
        return error;
    }
};

module.exports = {
    buildAgentCollection,
    buildSpecificAgent
};
