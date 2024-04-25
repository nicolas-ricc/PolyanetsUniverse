import { renderMap } from "./elements.js";
import fs from "fs";
export default function createHtmlMap(map, path) {
    const html = renderMap(map);
    fs.writeFile(path, html, (err)=>{
        err && console.error(err);
    });
}
