const petalUpperCurve = (map)=>{
    if (!map) return null;
    const newMap = [
        ...map
    ];
    newMap[0] && (()=>{
        newMap[0][0] = "POLYANET";
    })();
    const size = 4;
    const fullLength = size * 3;
    const firstHalfLogic = (x, y)=>{
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
    const secondHalfLogic = (x, y)=>{
        if ([
            x + (fullLength - y),
            x - 1 + (fullLength - y)
        ].includes(y)) {
            return "POLYANET";
        }
        return null;
    };
    return newMap.map((row, x)=>{
        return row.map((col, y)=>{
            const isFirstHalf = y < size * 2;
            if (isFirstHalf) {
                return firstHalfLogic(x, y) ?? col;
            } else {
                return secondHalfLogic(x, y) ?? col;
            }
        });
    });
};
export const flowerGen = (map, initialX, initialY)=>{
    if (!map) return null;
    const DEFAULT_SIZE = 4 // Plan to make other size possibilities if I have time
    ;
    const size = DEFAULT_SIZE;
    const flowerSlice = map.slice(initialX, size * 3 + 1).map((row)=>row.slice(initialY, size * 3 + 1));
    const mapWithUpper = petalUpperCurve(flowerSlice);
    const newMap = [
        ...mapWithUpper
    ];
    const mirror = (_map)=>[
            ..._map.map((row)=>[
                    ...row
                ].reverse())
        ].reverse();
    const fullPetal = mirror(petalUpperCurve(mirror(newMap)));
    const fullLeft = [
        ...fullPetal,
        ...[
            ...fullPetal
        ].reverse().slice(1)
    ];
    const flower = fullLeft.map((row)=>[
            ...row,
            ...[
                ...row
            ].reverse().slice(1)
        ]);
    const mapWithFlower = [
        ...map.slice(0, initialX),
        ...flower.map((frow, fidx)=>[
                ...map[fidx].slice(0, initialY),
                ...frow,
                ...map[fidx].slice(initialY + frow.length)
            ]),
        ...map.slice(initialX + flower.length)
    ];
    return mapWithFlower;
};
