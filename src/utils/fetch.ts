import { calcRating } from "./rating"
import { getCookie, parseNumber } from "./utils"
import { msgText } from "../stores"

const Difficulty = {
    basic: "BAS",
    advanced: "ADV",
    expert: "EXP",
    master: "MAS",
    ultima: "ULT"
} as Record<string, ChunirecDifficulty>

async function getSongList(diff = Difficulty.master) {
    const fd = new FormData()
    fd.append("genre", "99")
    fd.append("token", getCookie("_t"))
    const api = {
        [Difficulty.ultima]: "sendUltima",
        [Difficulty.master]: "sendMaster",
        [Difficulty.expert]: "sendExpert",
        [Difficulty.advanced]: "sendAdvanced",
        [Difficulty.basic]: "sendBasic"
    }
    const res = await fetch(`https://chunithm-net-eng.com/mobile/record/musicGenre/${api[diff]}`, {
        headers: { "Cache-Control": "no-cache" },
        method: "POST",
        body: fd
    })
    const formList = [...$(await res.text()).find("form")]
    formList.shift()
    return formList
}

async function fetchRawRecord() {
    const rawSongList: HTMLFormElement[][] = []

    for (const difficulty of Object.values(Difficulty)) {
        msgText.set(`Fetching ${difficulty} record...`)
        rawSongList.push(await getSongList(difficulty))
    }

    return rawSongList.flatMap((d, di) =>
        d.map(s => {
            const songData = $(s)
            const icons = songData.find(".play_musicdata_icon")
            let clear = null
            if (icons.length) {
                if (icons.find(`img[src*="alljustice"]`).length) clear = "AJ"
                else if (icons.find(`img[src*="fullcombo"]`).length) clear = "FC"
                
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

export async function getRecord() {
    msgText.set("Fetching song data...")
    const musicData = await (await fetch("https://raw.githubusercontent.com/Dogeon188/chuni_new_intl_viewer/main/songData.json")).json()
    const recordList = await fetchRawRecord() as ChuniRecord[]

    msgText.set("Calculating data...")
    recordList.map(r => {
        const songInfo = musicData[r.title]
        if (songInfo === undefined) {
            alert(`[chuni-intl-viewer] Found unknown song "${r.title} ${r.difficulty}".\nThe data should be updating soon, please run chuni-viewer again later to get proper song data.`)
            fetch(new Request("https://chuniupdate.dogeon188.repl.co/sendUpdate", { method: "POST" }))
            r.const = 0
            r.rating = 0
            return
        }
        r.const = songInfo[r.difficulty]
        r.rating = calcRating(r.score, r.const)
    })
    recordList.sort((a, b) => b.rating - a.rating || b.const - a.const)
    recordList.map((r, i) => { r.rank = i + 1 })
    return recordList
}

export async function getPlayerStats(): Promise<ChuniPlayerStats> {
    const res = await fetch(`https://chunithm-net-eng.com/mobile/home/`)
    const homePage = $(await res.text())
    const rating = [...homePage.find(".player_rating_num_block img")].map(i => {
            const imgSrc = i.getAttribute("src") ?? ""
            if (/rating_.*_comma.png/.test(imgSrc)) return "."
            let num = (/rating_.*_[0-9]*(?=\.png)/g.exec(imgSrc) ?? ["**.**"])[0]
            return num.slice(-1)
        }
    ).join("")
    const honorBg = homePage.find(".player_honor_short").css("background-image")
    return {
        name: homePage.find(".player_name_in")[0].innerHTML,
        honor: {
            text: homePage.find(".player_honor_text_view span")[0].innerHTML,
            type: (/honor_bg_.*(?=\.png)/g.exec(honorBg) ?? ["normal"])[0].slice(9)
        },
        rating
    }
}

export async function getOfficialR10() {
    const res = await fetch("https://chunithm-net-eng.com/mobile/home/playerData/ratingDetailRecent/")
    const musicData = await (await fetch("https://raw.githubusercontent.com/Dogeon188/chuni_new_intl_viewer/main/songData.json")).json()
    const r10list = [...$(await res.text()).find("form")].map(s => {
        const songData = $(s)
        const r = {
            score: parseNumber(songData.find(".text_b")?.text()),
            title: songData.find(".music_title")?.text(),
            diff: Object.values(Difficulty)[+songData.find("input[name=diff]")?.attr("value")]
        }
        return calcRating(r.score, musicData[r.title][r.diff])
    })
    return r10list.reduce((a, b) => a + b) / 10
}