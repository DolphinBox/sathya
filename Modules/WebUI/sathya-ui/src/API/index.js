const axios = require('axios');

let host = "http://localhost:3030/api/v1/";

export async function getState() {
    try {
        const response = await axios.get(host + 'state');
        return response;
    } catch (error) {
        console.error(error);
    }
}

export async function setState() {

}