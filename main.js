const axios = require("axios").default
const fs = require("fs")

let oldData = JSON.parse(fs.readFileSync("data/jp.json"))

let musicData = {}

const logger = fs.createWriteStream("log.md")
const log = (m = "") => { logger.write(m + "\n") }

log("# Chunithm Viewer - Song Data Changelog\n")

const parseData = (rawData) => {
    let errors = { dup: [], unc: [] }
    console.log("Fetched song data. Now parsing it...")
    for (const song of rawData) {
        // special case for "Reach For The Stars"
        if (song.meta.title == "Reach for the Stars") song.meta.title = "Reach For The Stars"

        if (musicData[song.meta.title] !== undefined) {
            errors.dup.push(song.meta.title)
        }
        if (Object.keys(song.data).includes("WE")) {
            continue
        }
        musicData[song.meta.title] = {}
        for (const diff in song.data) {
            if (song.data[diff].const === 0) {
                if (song.data[diff].is_const_unknown && song.data[diff].level > 9.5) {
                    errors.unc.push([song.meta.title, diff, song.data[diff].level])
                }
                musicData[song.meta.title][diff] = song.data[diff].level
            } else {
                musicData[song.meta.title][diff] = song.data[diff].const
            }
        }
    }

    if (errors.unc.length || errors.dup.length) {
        log("## Errors\n")
        if (errors.dup.length) {
            log(`### Duplicated songs\n`)
            errors.dup.forEach(s => { log("- " + s) })
            log()
        }
        if (errors.unc.length) {
            log(`### Songs w/ unknown const\n`)
            log("Name|Diff.|Level")
            log("----|-----|-----")
            errors.unc.forEach(s => { log(`${s[0]}|\`${s[1]}\`|\`${s[2]}\``) })
            log()
        }
    }
}

const compareData = () => {
    log("## Changes\n")
    let news = {}
    let diff = {}

    for (let i in musicData) {
        if (!oldData.hasOwnProperty(i)) {
            news[i] = musicData[i]
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

    if (Object.keys(news).length) {
        log("### New songs\n")
        log("Name|BAS|ADV|EXP|MAS|ULT")
        log("----|---|---|---|---|---")
        for (let i in news) {
            log(`${i}|\`${Object.values(news[i]).join("\`|\`")}\``)
        }
        log()
    }

    if (Object.keys(diff).length) {
        log("### Changed songs\n")
        log("Name|Diff.|Old|New")
        log("----|-----|---|---")
        for (let i in diff) {
            for (let d in diff[i]) {
                log(`${i}|\`${d}\`|\`${diff[i][d].old}\`|\`${diff[i][d].new}\``)
            }
        }
        log()
    }

    if (Object.keys(oldData).length) {
        log("### Deleted songs\n")
        log("Name|BAS|ADV|EXP|MAS|ULT")
        log("----|---|---|---|---|---")
        for (let i in oldData) {
            log(`${i}|\`${Object.values(oldData[i]).join("\`|\`")}\``)
        }
        log()
    }
}

axios.get("https://api.chunirec.net/2.0/music/showall.json?region=jp2&token=" + process.env.CHUNIREC_TOKEN).then(res => {
    parseData(res.data)
    console.log("Parsed data.")
    console.log("Comparing data difference...")
    compareData()
    fs.writeFileSync("data/jp.json", JSON.stringify(musicData))
    console.log("Stored data to file")
})