const { request } = require("https")
const fs = require("fs")

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
        musicData[song.meta.title] = {}
        for (const diff in song.data) {
            musicData[song.meta.title][diff] = (song.data[diff].const === 0) ? 
                song.data[diff].level :
                song.data[diff].const
        }
    }
    fs.writeFileSync("songData.json", JSON.stringify(musicData))
    console.log("Parsed data and stored at songData.json")
}

console.log("Fetching raw song data...")
const req = request({
    hostname: "api.chunirec.net",
    path: "/2.0/music/showall.json?token=252db1d77e53f52fd85c5b346fef7c90e345b3b3f0b12018a2074298e4b35182&region=jp2",
    method: "GET"
}, res => {
    res.on('data', d => {rawData += d})
    res.on("end", parseData)
})
req.on("error", console.error)
req.end()