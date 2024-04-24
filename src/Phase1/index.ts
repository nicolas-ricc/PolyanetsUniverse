import { updateCelestials } from "utils/updateRemote";
import {createMap} from "./mapBuilder"
import createHtmlMap from "utils/render";

const map = createMap(11)
createHtmlMap(map)
updateCelestials(map).then(res => console.log(res))