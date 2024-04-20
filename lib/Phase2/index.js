import { flowerGen } from "./flowerGen.js";
import { addSoloonsAndComets } from "./soloonsAndComeths.js";
import { EventEmitter } from "events";
import "../../src/config.js";
import fs from "fs";
import { updateCelestials, cleanBoard } from "./updateRemote.js";
import renderMap from "../utils/elements.js";

const initialMap = new Array(30).fill([]).map(()=>new Array(30).fill("SPACE"));
const flowerGenExample = ()=>flowerGen(initialMap, 1, 1);
const sprinkled = addSoloonsAndComets(flowerGenExample());

function createHtmlMap(map) {
    const html = renderMap(map);
    fs.writeFile("./lib/Phase2/flowerGen.html", html, undefined, (err)=>{
        err && console.error(err);
    });
}

createHtmlMap(sprinkled);
const emmiter = new EventEmitter();

const clean = () => cleanBoard().then((res)=>console.log(res));
emmiter.on("clean-row-fulfilled", (arg)=>{
    if (arg === 29) {
        console.log("end of cleaning");
    }
});
const post = async() => await updateCelestials(sprinkled).then((res)=> console.log(res));
emmiter.on("post-row-fulfilled", (arg)=>{
    if (arg === 29) {
        console.log("end of posting");
    }
});

post()

