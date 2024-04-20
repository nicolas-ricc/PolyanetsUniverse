import { celestial, universe } from "map";

const petalUpperCurve = (map: universe): universe | null => {
    if(!map) return null;
    const newMap = [
        ...map
    ];
    newMap[0] && (() => {newMap[0][0] = "POLYANET"})();
    const size = 4;
    const fullLength = size * 3;
    const firstHalfLogic = (x: number, y: number) => {
        if (x === 0 && y === 0) {
            return "POLYANET";
        }
        if ([
            x * 2,
            x * 2 + 1
        ].includes(y)) {
            return "POLYANET";
        }
        return null;
    };
    const secondHalfLogic = (x: number, y: number) => {
        if ([
            x + (fullLength - y),
            x - 1 + (fullLength - y)
        ].includes(y)) {
            return "POLYANET";
        }
        return null;
    };
    return newMap.map((row, x) => {
        return row.map((col, y) => {
            const isFirstHalf = y < size * 2;
            if (isFirstHalf) {
                return firstHalfLogic(x, y) ?? col;
            } else {
                return secondHalfLogic(x, y) ?? col;
            }
        });
    });
};

export const flowerGen = (map: universe, initialX: number, initialY: number): universe | null => {
    if(!map) return null;
    const DEFAULT_SIZE = 4 // Plan to make other size possibilities if I have time
    const size = DEFAULT_SIZE
    const flowerSlice: universe = map.slice(initialX, (size * 3) + 1).map((row) => row.slice(initialY, (size * 3) + 1));
    const mapWithUpper: universe = petalUpperCurve(flowerSlice) as universe;
    const newMap: universe = [
        ...mapWithUpper
    ];
    const mirror = (_map: universe): universe => [
        ..._map.map((row: celestial[]) => [
            ...row
        ].reverse())
    ].reverse();
    const fullPetal = mirror(petalUpperCurve(mirror(newMap)) as universe);
    const fullLeft = [
        ...fullPetal,
        ...[
            ...fullPetal
        ].reverse().slice(1)
    ];
    const flower = fullLeft.map((row) => [
        ...row,
        ...[
            ...row
        ].reverse().slice(1)
    ]);
    const mapWithFlower: universe = [
        ...map.slice(0, initialX),
        ...flower.map((frow, fidx) => [
            ...(map[fidx] as celestial[]).slice(0, initialY),
            ...frow,
            ...(map[fidx] as celestial[]).slice(initialY + frow.length)
        ]),
        ...map.slice(initialX + flower.length)
    ];
    return mapWithFlower as universe;
};



