import { updateCelestials } from "utils/updateRemote";
import { createMap } from "./mapBuilder.js";
import createHtmlMap from "utils/render";
const map = createMap(11);
createHtmlMap(map);
//This is commented since is not possible to update previous goal
//updateCelestials(map).then((res)=>console.log(res));
