import { createMap } from "./mapBuilder.js";
import createHtmlMap from "../utils/render.js";
const map = createMap(11);
createHtmlMap(map, "./lib/Phase1/crossGen.html");
//This is commented since is not possible to update previous goal
//updateCelestials(map).then((res)=>console.log(res));
