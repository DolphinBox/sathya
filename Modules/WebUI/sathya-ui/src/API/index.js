const axios = require('axios');
export async function callAPI(endpoint) {
    try {
        const response = await axios.get('http://localhost:3030/api/v1/state');
        return response;
    } catch (error) {
        console.error(error);
    }
}