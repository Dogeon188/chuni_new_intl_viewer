import { calcRating } from "./rating"
import { getCookie, parseNumber } from "./utils"

const Difficulty = {
    ultima: "ULT",
    master: "MAS",
    expert: "EXP",
    advance: "ADV",
    basic: "BAS"
}

async function getSongList (diff = Difficulty.master) {
    const fd = new FormData()
    fd.append("genre", "99")
    fd.append("token", getCookie("_t"))
    const api = {
        [Difficulty.ultima]: "sendUltima",
        [Difficulty.master]: "sendMaster",
        [Difficulty.expert]: "sendExpert",
        [Difficulty.advance]: "sendAdvance",
        [Difficulty.basic]: "sendBasic"
    }
    const res = await fetch(`https://chunithm-net-eng.com/mobile/record/musicGenre/${api[diff]}`, {
        headers: { "Cache-Control": "no-cache" },
        method: "POST",
        body: fd
    })
    const htmlStr = await res.text()
    const formList = [...$(htmlStr).find("form")]
    formList.shift()
    return formList
}

async function fetchRawRecord () {
    const rawSongList = []

    for (const difficulty of Object.values(Difficulty)) {
        rawSongList.push(await getSongList(difficulty))
    }

    return rawSongList.flatMap((d, di) => 
        d.map(s => {
            const songData = $(s)
            const icons = songData.find(".play_musicdata_icon")
            let clear = null
            if (icons.length) {
                for (const clearType of ["fullchain", "fullchain2", "alljustice", "fullcombo"]) {
                    if (icons.find(`img[src*="${clearType}"]`).length) {
                        clear = clearType
                        break
                    }
                }
            }
            return {
                title: songData.find(".music_title")?.text(),
                score: parseNumber(songData.find(".text_b")?.text()),
                difficulty: Object.values(Difficulty)[di],
                clear
            }
        }).filter(s => s.title !== null && s.score > 0)
    )
}

export async function getRecord () {
    const musicData = await (await fetch("https://raw.githubusercontent.com/Dogeon188/chuni_new_intl_viewer/main/songData.json")).json()

    // do rating calc for record list
    const recordList = await fetchRawRecord() as ChuniRecord[]
    recordList.map(r => {
        const songInfo = musicData[r.title]
        if (songInfo === undefined) {
            alert(`[chuni-intl-viewer] Found unknown song "${r.title} ${r.difficulty}".\nThe data should be updating soon, please run chuni-viewer again later to get proper song data.`)
            fetch(new Request("https://chuniupdate.dogeon188.repl.co/sendUpdate", {method: "POST"}))
            r.const = 0
            r.rating = 0
            return
        }
        r.const = songInfo[r.difficulty]
        r.rating = calcRating(r.score, r.const)
    })
    recordList.sort((a, b) => b.rating - a.rating || b.const - a.const)
    recordList.map((r, i) => {r.rank = i + 1})
    return recordList
}