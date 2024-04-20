import { celestial, universe } from "map";

export const addSoloonsAndComets = (map: universe) => {
    return map.map((row: celestial[], ridx: number) => {
        return row.map((y: celestial, yidx: number) => {
            if (y === "SPACE") {
                if ([
                    map[yidx - 1],
                    map[yidx + 1],
                    map[ridx - 1]?.[yidx],
                    map[ridx + 1]?.[yidx]
                ].includes("POLYANET")) {
                    const solprob = Math.random();
                    if (solprob > 0.8) {
                        const base = "SOLOON";
                        const colorProb = Math.random();
                        const getColor = (prob: number) => {
                            if (prob > 0.75) {
                                return "RED";
                            } else if (prob > 0.5) {
                                return "BLUE";
                            } else if (prob > 0.25) {
                                return "PURPLE";
                            }
                            return "WHITE";
                        };
                        const color = getColor(colorProb);
                        const coloured = base.concat("_").concat(color);
                        return coloured;
                    }
                    return y;
                }
                const cometprob = Math.random();
                if (cometprob > 0.9) {
                    const getDirection = (prob: number) => {
                        if (prob > 0.75) {
                            return "UP";
                        } else if (prob > 0.5) {
                            return "DOWN";
                        } else if (prob > 0.25) {
                            return "LEFT";
                        }
                        return "RIGHT";
                    };
                    const dirProb = Math.random();
                    const directed = "COMETH".concat("_").concat(getDirection(dirProb));
                    return directed;
                }
                return y;
            }
            return y;
        });
    });
};