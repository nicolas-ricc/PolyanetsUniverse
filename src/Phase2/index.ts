import { universe } from "map";
import { flowerGen } from "./flowerGen";
import { addSoloonsAndComets } from "./soloonsAndComeths";
import { updateCelestials } from "../utils/updateRemote";
import createHtmlMap from "../utils/render"
import "../config";

const initialMap = new Array(30).fill([]).map(() => new Array(30).fill("SPACE"))

const flowerGenExample = () => flowerGen(initialMap, 2, 2)
const sprinkled = addSoloonsAndComets(flowerGenExample() as universe)

createHtmlMap(sprinkled);
updateCelestials(sprinkled).then(res => console.log(res))