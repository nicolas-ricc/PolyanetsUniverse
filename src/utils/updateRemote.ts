import axios from "axios";
import lodash from "lodash";
import { table, universe } from "map";
import sleepSync from "utils/sleep";

const { isEqual } = lodash



const candidateId = '85bb9c46-0026-42cb-b6d9-e4e0331f718b';
type reqType = "polyanets" | "soloons" | "comeths"
const postCelestials = async ({type, row, column, extraFeatures}: {
    type: reqType,
    row: table["row"],
    column: table["column"],
    extraFeatures?: Record<string, any>
}) => new Promise((resolve) => {
    {
        sleepSync(1000);
        resolve(axios(`https://challenge.crossmint.io/api/${type}`, {
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
        }).catch((err) => console.error(err)));
    }
});
const deleteCelestials = async ({type, row, column}: {
    type: reqType,
    row: table["row"],
    column: table["column"],
}) => new Promise((resolve) => {
    {
        sleepSync(1000);
        resolve(() => axios(`https://challenge.crossmint.io/api/${type}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.parse(JSON.stringify({
                candidateId: candidateId,
                row: row,
                column: column
            }))
        }).catch((err) => console.error(err)));
    }
});

export async function updateCelestials(map: universe): Promise<void> {
    return await new Promise((resolve) => resolve(axios.get(`https://challenge.crossmint.io/api/map/${candidateId}`).then(async (data) => {
        const remote = data.data.map.content;
        const reqList: {
            method: "POST" | "DELETE",
            type: reqType,
            row: table["row"],
            column: table["column"],
            extraFeatures?: Record<string, any>
        } [] = [];
        if (!isEqual(remote, map)) {
            const triesAndRetries = async (map: universe) => {
                map.reduce((_, row, rowIdx) => {
                    if (!isEqual(row, remote[rowIdx])) {
                        return row.reduce((_, column, columnIdx) => {
                            const indexInRemote = remote[rowIdx][columnIdx];
                            if (column !== "SPACE") {
                                if (column === "POLYANET") {
                                    if (!indexInRemote || indexInRemote?.type !== 0) {
                                        reqList.push({
                                            method: "POST",
                                            type: "polyanets",
                                            row: rowIdx,
                                            column: column,
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
                                            column: column,
                                            extraFeatures: {
                                                direction: direction.toLowerCase()
                                            }
                                        });
                                    }
                                }
                            } else if (indexInRemote?.type) {
                                const celestialInRemote = indexInRemote.type === 0 ? "polyanets" : indexInRemote.type === 1 ? "soloons" : "comeths";
                                reqList.push({
                                    method: "DELETE",
                                    type: celestialInRemote,
                                    row: rowIdx,
                                    column: column
                                });
                            }
                        }, null);
                    }
                }, null);
                await Promise.all(reqList.map(async(req) => {
                    if (req.method === "POST") {
                        return postCelestials(req);
                    } else {
                        return postCelestials(req);
                    }
                }));
            };
            return await triesAndRetries(map).then(async () => await updateCelestials(map)).catch(async (err) => {
                console.log(err);
            });
        } else return;
    })));
}

export const cleanBoard = async () => await axios.get(`https://challenge.crossmint.io/api/map/${candidateId}`).then(async (data) => {
    const remote: ("NULL" | {type: number})[][] = data.data.map.content
    return Promise.allSettled(remote.reduce((promiseRowArr, row: ("NULL" | {type: number})[], rowIdx: number) => {
        return [...promiseRowArr, Promise.allSettled(row.reduce((promiseColumnArr, column: ("NULL" | {type: number}), columnIdx) => {
            console.log("promises in column so far", promiseColumnArr)
            if ((column as {type: number})?.type !== undefined) {
                const celestialInRemote = (column as {type: number}).type === 0 ? "polyanets" : (column as {type: number}).type === 1 ? "soloons" : "comeths"
                return [...promiseColumnArr, deleteCelestials({ type: celestialInRemote, row: rowIdx, column: columnIdx })]
            }
            return [...promiseColumnArr]
        }, []))]
    }, []))
}).then((res) => console.log(res))