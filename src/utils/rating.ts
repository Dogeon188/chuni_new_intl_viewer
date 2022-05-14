export function calcRating(score: number, chartConst: number) {
    chartConst *= 100
    const points = [
        [1010000, chartConst + 215],
        [1009000, chartConst + 215],
        [1007500, chartConst + 200],
        [1005000, chartConst + 150],
        [1000000, chartConst + 100],
        [975000, chartConst],
        [925000, chartConst - 300],
        [900000, chartConst - 500],
        [800000, (chartConst - 500) / 2],
        [500000, 0],
        [0, 0]
    ]
    let p = 1
    points.some((v, i) => (p = i, score > v[0]))
    const prev = points[p - 1], cur = points[p]
    const ret = cur[1] + (prev[1] - cur[1]) / (prev[0] - cur[0]) * (score - cur[0])
    return Math.floor(ret + Number.EPSILON) / 100
}

export function calcB30(ratingList: number[]) {
    return ratingList.slice(0, 30).reduce((a, b) => a + b) / 30
}

export function calcMaxRating(ratingList: number[]) {
    return (calcB30(ratingList) * 30 + ratingList[0] * 10) / 40
}