import { renderMap } from "./elements.js";
import fs from "fs";
export default function createHtmlMap(map) {
    const html = renderMap(map);
    fs.writeFile("./lib/Phase2/flowerGen.html", html, (err)=>{
        err && console.error(err);
    });
}
