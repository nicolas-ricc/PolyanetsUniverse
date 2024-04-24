export function createMap(sideLength: number): ("SPACE"|"POLYANET")[][] {
    const mapDowntownCoeffLimit = Math.floor(sideLength * 0.85)
    const map = new Array(sideLength).fill([]).map((_,heigthIdx) => {
        const row = new Array(sideLength).fill("SPACE").map((prefilledSpace,widthIdx) => {
            if(heigthIdx < mapDowntownCoeffLimit && heigthIdx > (sideLength - 1 - mapDowntownCoeffLimit) ){
                if([widthIdx, sideLength - 1 - widthIdx ].includes(
                    heigthIdx
                )
                ){
                    return "POLYANET"
                }
            }
            return prefilledSpace
        })

        return row
    })
    return map
}