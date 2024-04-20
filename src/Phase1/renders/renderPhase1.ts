const goalRetriever = require("../GoalMapRetriever")
const render = require("../../utils/elements")
const fs = require("fs")

function createHtmlMap(map: ("SPACE" | "POLYANET")[][]){
const html = render(map)
fs.writeFile("./lib/Phase1/renders/phase1.html", html, undefined, (err: Error) => {err && console.error(err)})
}

module.exports = {createHtmlMap}