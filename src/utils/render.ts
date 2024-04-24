import { universe } from "map";
import { renderMap } from "./elements";
import fs from "fs"

export default function createHtmlMap(map: universe) {
    const html = renderMap(map);
    fs.writeFile("./lib/Phase2/flowerGen.html", html, (err: Error) => {
        err && console.error(err);
    });
}
