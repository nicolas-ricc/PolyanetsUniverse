const builder = require("./mapBuilder");
const config = require("../config");
const axios = require("axios").default;
const map = builder.createMap(11);
const candidateId = '85bb9c46-0026-42cb-b6d9-e4e0331f718b';
async function postPolyanets() {
    const retries = [];
    await Promise.all(map.map(async (row, rowIdx)=>{
        await row.map(async (column, columnIdx)=>{
            if (column === "POLYANET") {
                axios.post(`https://challenge.crossmint.io/api/polyanets`, {
                    candidateId: candidateId,
                    row: rowIdx,
                    column: columnIdx
                }).then().catch((err)=>{
                    retries.push({
                        row: rowIdx,
                        column: columnIdx
                    });
                });
            }
        });
    }));
    retries.map(({ row, column })=>axios.post(`https://challenge.crossmint.io/api/polyanets`, {
            candidateId: candidateId,
            row,
            column
        }).then().catch((err)=>{}));
}
