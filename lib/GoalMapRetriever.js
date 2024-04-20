const get = require("axios").get;
async function getGoalMap() {
    const candidateId = '85bb9c46-0026-42cb-b6d9-e4e0331f718b';
    const getGoalMap = async ()=>get(`https://challenge.crossmint.io/api/map/${candidateId}/goal`);
    console.log((await getGoalMap()).data);
}
getGoalMap();
