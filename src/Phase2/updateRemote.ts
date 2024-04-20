import axios from "axios";
import { isEqual } from "lodash";

function sleepSync(ms: number) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}


const postCelestials = async (type, rowIdx, columnIdx, extraFeatures) => new Promise((resolve) => {
    {
        sleepSync(1000);
        resolve(axios(`https://challenge.crossmint.io/api/${type}`, {
            method: "POST",
            data: JSON.parse(JSON.stringify({
                candidateId: candidateId,
                row: rowIdx,
                column: columnIdx,
                ...extraFeatures
            })),
            headers: {
                "Content-Type": "application/json"
            }
        }).catch((err) => console.error(err)));
    }
});
const deleteCelestials = async (type, rowIdx, columnIdx) => new Promise((resolve) => {
    {
        sleepSync(1000);
        resolve(() => axios(`https://challenge.crossmint.io/api/${type}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.parse(JSON.stringify({
                candidateId: candidateId,
                row: rowIdx,
                column: columnIdx
            }))
        }).catch((err) => console.error(err)));
    }
});
export async function updateCelestials(map) {
    return await new Promise((resolve) => resolve(axios.get(`https://challenge.crossmint.io/api/map/${candidateId}`).then(async (data) => {
        const remote = data.data.map.content;
        const reqList = [];
        if (!isEqual(remote, map)) {
            const triesAndRetries = async (map) => {
                map.reduce((_, row, rowIdx) => {
                    if (!isEqual(row, remote[rowIdx])) {
                        return row.reduce((_, column, columnIdx) => {
                            const indexInRemote = remote[rowIdx][columnIdx];
                            if (column !== "SPACE") {
                                if (column === "POLYANET") {
                                    if (!indexInRemote || indexInRemote?.type !== 0) {
                                        reqList.push({
                                            method: "post",
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
                                            method: "post",
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
                                            method: "post",
                                            type: "comeths",
                                            row: rowIdx,
                                            column: columnIdx,
                                            extraFeatures: {
                                                direction: direction.toLowerCase()
                                            }
                                        });
                                    }
                                }
                            } else if (indexInRemote?.type) {
                                const celestialInRemote = indexInRemote.type === 0 ? "polyanets" : indexInRemote.type === 1 ? "soloons" : "comeths";
                                reqList.push({
                                    method: "delete",
                                    type: celestialInRemote,
                                    row: rowIdx,
                                    column: columnIdx
                                });
                            }
                        }, null);
                    }
                }, null);
                await Promise.all(reqList.map(async (req) => {
                    if (req.type === "post") {
                        return postCelestials(req.type, req.row, req.column, req.extraFeatures);
                    } else {
                        return deleteCelestials(req.type, req.row, req.column);
                    }
                }));
            };
            return await triesAndRetries(map).then(async () => await postPolyanets(map)).catch(async (err) => {
                console.log(err);
            });
        } else return;
    })));
}