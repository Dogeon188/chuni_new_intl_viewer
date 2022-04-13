const { request } = require("https")
const fs = require("fs")

let oldData = JSON.parse(fs.readFileSync("songData.json"))

let rawData = ""
let musicData = {}

// just a temporary wordaround, not sure Valsqotch EXP's chart constant
musicData["Valsqotch"] = {BAS: 5, ADV: 8.5, EXP: 13.5, MAS: 14.5}

const parseData = () => {
    console.log("Fetched song data. Now parsing it...")
    let rawDataJSON = JSON.parse(rawData)
    for (const song of rawDataJSON) {
        if (musicData[song.meta.title] !== undefined) {
            console.log(`Found duplicate song title "${song.meta.title}"! Should check before actually using the data.`)
        }
        if (Object.keys(song.data).includes("WE")) {
            continue
        }
        musicData[song.meta.title] = {}
        for (const diff in song.data) {
            if (song.data[diff].const === 0) {
                if (["ULT", "MAS"].includes(diff)) {
                    console.log(`    ${song.meta.title} ${diff} doesn't have chart constant!`)
                } else {
                    musicData[song.meta.title][diff] = song.data[diff].level
                }
            } else {
                musicData[song.meta.title][diff] = song.data[diff].const
            }
        }
    }
}

const compareData = () => {
    let diff = {}

    console.log("New song(s):")
    for (let i in musicData) {
        if (!oldData.hasOwnProperty(i)) {
            console.log("   ", i, musicData[i])
        } else {
            for (let d in oldData[i]) {
                if (oldData[i][d] !== musicData[i][d]) {
                    diff[i] = diff[i] || {}
                    diff[i][d] = {
                            old: oldData[i][d],
                            new: musicData[i][d]
                        }
                }
            }
            delete oldData[i]
        }
    }
    console.log("Changed song(s):")
    for (let i in diff) {
        console.log("   ", i)
        for (let d in diff[i]) {
            console.log("       ", d, diff[i][d].old, "->", diff[i][d].new)
        }
    }
    console.log("Deleted song(s):")
    for (let i in oldData) {
        console.log("   ", i, oldData[i])
    }
}

const req = request(
    "https://api.chunirec.net/2.0/music/showall.json?token=252db1d77e53f52fd85c5b346fef7c90e345b3b3f0b12018a2074298e4b35182&region=jp2",
    {method: "GET"},
    res => {
    res.on('data', d => {rawData += d})
    res.on("end", () => {
        parseData()
        console.log("Parsed data.")
        console.log("Comparing data difference...")
        compareData()
        fs.writeFileSync("songData.json", JSON.stringify(musicData))
        console.log("Stored data at songData.json")
    })
})
req.on("error", console.error)
req.end()