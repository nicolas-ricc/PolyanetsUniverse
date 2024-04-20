import { universe } from "map";
import { flowerGen } from "./flowerGen";
import { addSoloonsAndComets } from "./soloonsAndComeths";
import { EventEmitter } from "stream";
import "../../src/config";
import fs from "fs";
import { updateCelestials } from "./updateRemote";



const initialMap = new Array(30).fill([]).map(() => new Array(30).fill("SPACE"))

const flowerGenExample = () => flowerGen(initialMap, 1, 1)
const sprinkled = addSoloonsAndComets(flowerGenExample() as universe)
function createHtmlMap(map: universe) {
    const html = render(map);
    fs.writeFile("./lib/flowerGen.html", html, (err: Error) => {
        err && console.error(err);
    });
}
const candidateId = '85bb9c46-0026-42cb-b6d9-e4e0331f718b';

function sleepSync(ms: number) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

const postCelestials = async (type: string, rowIdx: number, columnIdx: number, extraFeatures: Record<string, string>): Promise<void> => new Promise((resolve) => {
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
    }).catch((err) => console.error(err)))
}})


const deleteCelestials = async (type: string, rowIdx: number, columnIdx: number) => new Promise((resolve) => {
    {
    sleepSync(1000)
    resolve(() =>  axios(`https://challenge.crossmint.io/api/${type}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.parse(JSON.stringify({
            candidateId: candidateId,
            row: rowIdx,
            column: columnIdx
        }))
    }).catch((err: Error) => console.error(err)))
}})

createHtmlMap(sprinkled);

//postPolyanets(sprinkled)
const emmiter = new EventEmitter()
const cleanBoard = async () => await axios.get(`https://challenge.crossmint.io/api/map/${candidateId}`).then(async (data) => {
    const remote = data.data.map.content
    console.log(remote[0].length)

    return Promise.allSettled(remote.reduce((promiseRowArr, row, rowIdx) => {
        return [...promiseRowArr, Promise.allSettled(row.reduce((promiseColumnArr, column, columnIdx) => {
            console.log("promises in column so far", promiseColumnArr)
            if (column?.type !== undefined) {
                const celestialInRemote = column.type === 0 ? "polyanets" : column.type === 1 ? "soloons" : "comeths"
                return [...promiseColumnArr, deleteCelestials(celestialInRemote, rowIdx, columnIdx)]
            }
            return [...promiseColumnArr]
        }, [])).then(() => emmiter.emit("clean-row-fulfilled", rowIdx))]
    }, []))
}).then((res) => console.log(res))



const clean = (async() => cleanBoard().then(res => console.log(res)))()
emmiter.on("clean-row-fulfilled", (arg) => {
    if(arg === 29){
        console.log("end of cleaning")
    }
}
)

const post = (async () => updateCelestials(sprinkled).then(res => console.log(res)))()
emmiter.on("post-row-fulfilled", (arg) => {
    if (arg === 29) {
        console.log("end of posting")
    }
}
)