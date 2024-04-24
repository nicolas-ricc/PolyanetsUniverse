import axios from "axios";
import lodash from "lodash";
import sleepSync from "../utils/sleep.js";
const { isEqual } = lodash;
const candidateId = '85bb9c46-0026-42cb-b6d9-e4e0331f718b';
const postCelestials = async ({ type, row, column, extraFeatures }) => {
    console.log("posting", row, column)
    return axios(`https://challenge.crossmint.io/api/${type}`, {
        method: "POST",
        data: JSON.parse(JSON.stringify({
            candidateId: candidateId,
            row: row,
            column: column,
            ...extraFeatures
        })),
        headers: {
            "Content-Type": "application/json"
        }
    }).catch((err) => console.error(err));
}

const deleteCelestials = async ({ type, row, column }) => {
    console.log("deleting", row, column)
    return axios(`https://challenge.crossmint.io/api/${type}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },


        data: JSON.parse(JSON.stringify({
            candidateId: candidateId,
            row: row,
            column: column
        }))
    }).catch((err) => console.error(err));
};

const convertToCelestial = (indexInRemote) => {
    const parsed = JSON.parse(JSON.stringify(indexInRemote))
    return parsed.type !== undefined ? indexInRemote.type === 0 ? "POLYANET" : indexInRemote.type === 1 ? "SOLOON" : "COMETH" : undefined;
}

export async function updateCelestials(map) {
    const rawRemote = await axios.get(`https://challenge.crossmint.io/api/map/${candidateId}`)
    const remote = rawRemote.data.map.content;

    let reqList = [];
    const triesAndRetries = async (map) => {
        map.reduce((_, row, rowIdx) => {
            return row.reduce((_, column, columnIdx) => {
                const indexInRemote = remote[rowIdx][columnIdx];
                if (!indexInRemote || !(convertToCelestial(indexInRemote).includes(column))) {
                    if (column !== "SPACE") {
                        if (column === "POLYANET") {
                            if (!indexInRemote || indexInRemote?.type !== 0) {
                                reqList.push({
                                    method: "POST",
                                    type: "polyanets",
                                    row: rowIdx,
                                    column: columnIdx,
                                    extraFeatures: {}
                                });
                            }
                        }
                        if (/SOLOON/.test(column)) {
                            if (!indexInRemote || indexInRemote?.type !== 1) {
                                const color = column.split("_")[1];
                                reqList.push({
                                    method: "POST",
                                    type: "soloons",
                                    row: rowIdx,
                                    column: columnIdx,
                                    extraFeatures: {
                                        color: color.toLowerCase()
                                    }
                                });
                            }
                        }
                        if (/COMETH/.test(column)) {
                            if (!indexInRemote || indexInRemote?.type !== 2) {
                                const direction = column.split("_")[1];
                                reqList.push({
                                    method: "POST",
                                    type: "comeths",
                                    row: rowIdx,
                                    column: columnIdx,
                                    extraFeatures: {
                                        direction: direction.toLowerCase()
                                    }
                                });
                            }
                        }
                    }
                    else if (indexInRemote) {
                        const celestial = convertToCelestial(indexInRemote)
                        reqList.push({
                            method: "DELETE",
                            type: celestial.toLowerCase().concat('s'),
                            row: rowIdx,
                            column: columnIdx
                        });
                    }
                    else return;
                }

            }, null);
        }, null);

        const failedReqs = []

        function runRequestsSequentally(promise, req) {
            return new Promise((resolve) => {
                resolve(promise.then(_ => {
                    sleepSync(1000)
                    if (req.method === "POST") {
                        return postCelestials(req).catch(err => failedReqs.push(req))
                        
                    } else {
                        return deleteCelestials(req).catch(err => failedReqs.push(req))
                    }
                }));
            });
        }

        reqList.reduce(runRequestsSequentally, Promise.resolve())
        reqList = failedReqs
    };
    return triesAndRetries(map).then(() => reqList.length > 0 && triesAndRetries(map)).catch(async (err) => {
        console.log(err);
    });
}


export const cleanBoard = async () => await axios.get(`https://challenge.crossmint.io/api/map/${candidateId}`).then(async (data) => {
    const remote = data.data.map.content;
    const reqList = remote.reduce((_reqList, row, rowIdx) => {
        return [..._reqList, row.map((_, columnIdx) => {
            if (remote[rowIdx][columnIdx]) {
                return {
                    method: "DELETE",
                    type: convertToCelestial(remote[rowIdx][columnIdx]).toLowerCase().concat('s'),
                    row: rowIdx,
                    column: columnIdx
                };
            }
        }).filter(Boolean)].flat()
    }, [])

    function runRequestsSequentally(promise, req) {
        return new Promise((resolve) => {
            resolve(promise.then(_ => {
                sleepSync(1000)
                return deleteCelestials(req)
            }));
        });
    }

    reqList.reduce(runRequestsSequentally, Promise.resolve())

})