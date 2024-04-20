const goalRetriever = require("../GoalMapRetriever");
const render = require("../../utils/elements");
const fs = require("fs");
function createHtmlMap(map) {
    const html = render(map);
    fs.writeFile("./lib/Phase1/renders/phase1.html", html, undefined, (err)=>{
        err && console.error(err);
    });
}
module.exports = {
    createHtmlMap
};
