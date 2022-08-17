import { get } from "svelte/store"
import { calcRating } from "@/utils/rating"
import { getCookie, parseNumber } from "@/utils/utils"
import { errorFetching, msgText } from "@/stores"
import { filterDiff, usedSongData } from "@/config"

const Difficulty = {
    basic: "BAS",
    advanced: "ADV",
    expert: "EXP",
    master: "MAS",
    ultima: "ULT"
} as Record<string, ChunirecDifficulty>

async function getSongData() {
    return await fetch(`https://raw.githubusercontent.com/Dogeon188/chuni_new_intl_viewer/data/data/${get(usedSongData)}.json`).then(d => d.json())
}

export async function getSongList(diff: ChunirecDifficulty = Difficulty.master) {
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
    if (res.url == "https://chunithm-net-eng.com/mobile/error/") {
        errorFetching.set(true)
        msgText.set(`
            Error fetching song record!<br/>
            It might be caused by an outdated token.<br/>
            <em>Reload the page</em> or <em>re-login CHUNITHM-NET</em> might help...`)
        return []
    }
    const recList = $(await res.text()).find(".box01.w420").eq(1)
        .find("form").map(function () {
            const songData = $(this)
            const icons = songData.find(".play_musicdata_icon")
            return {
                title: songData.find(".music_title")?.text(),
                score: parseNumber(songData.find(".text_b")?.text()),
                difficulty: diff,
                clear: icons.find(`img[src*="alljustice"]`).length ? "AJ" :
                    icons.find(`img[src*="fullcombo"]`).length ? "FC" : "",
                idx: songData.find(`input[name="idx"]`).attr("value")
            }
        }).get().filter(s => s.title !== null && s.score > 0)
    return recList as RawChuniRecord[]
}

export async function fetchRawRecord() {
    const rawRecList: RawChuniRecord[] = []

    for (const [i, diff] of Object.values(Difficulty).entries()) {
        if (!get(filterDiff).at(i)) {
            continue
        }
        msgText.set(`Fetching ${diff} record...`)
        Array.prototype.push.apply(rawRecList, await getSongList(diff))
        if (get(errorFetching)) return []
    }

    return rawRecList
}

export async function parseRecords(rawRecord: RawChuniRecord[]) {
    msgText.set("Fetching song data...")
    const musicData = await getSongData()
    const recordList = rawRecord as ChuniRecord[]
    if (get(errorFetching)) return []

    msgText.set("Calculating data...")
    const cannotFetch = [] as ChuniRecord[]
    recordList.map(r => {
        const songInfo = musicData[r.title]
        if (songInfo === undefined) {
            cannotFetch.push(r)
            r.const = 0
            r.rating = 0
            return
        }
        r.const = songInfo[r.difficulty]
        r.rating = calcRating(r.score, r.const)
    })
    if (cannotFetch.length) {
        alert(`[chuni-intl-viewer] Found unknown song(s):\n${cannotFetch.map(r => `    ${r.title} ${r.difficulty}`).join("\n")
            }\nThe data should be updating soon, please run chuni-viewer again later to get proper song data.`)
        fetch(new Request("https://chuniupdate.dogeon188.repl.co/sendUpdate", {
            method: "POST",
            body: JSON.stringify(cannotFetch.map(r => [r.title, r.difficulty])),
            headers: { "Content-Type": "application/json;charset=utf-8" }
        }))
    }
    recordList.sort((a, b) => b.rating - a.rating || b.const - a.const || a.score - b.score)
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
            type: (/honor_bg_.*(?=\.png)/.exec(honorBg) ?? ["normal"])[0].slice(9)
        },
        rating,
        ratingMax: homePage.find(".player_rating_max")[0].innerHTML
    }
}

export async function fetchRecent() {
    const res = await fetch("https://chunithm-net-eng.com/mobile/record/playlog")
    const recentList = $(await res.text()).find(".mt_10 .frame02.w400").map(function () {
        const songData = $(this)
        const icons = songData.find(".play_musicdata_icon")
        const diffString = /musiclevel_.*(?=\.png)/.exec(
            songData.find(".play_track_result img").attr("src"))[0].slice(11)
        return {
            title: songData.find(".play_musicdata_title")?.text(),
            score: parseNumber(songData.find(".play_musicdata_score_text")?.text()),
            difficulty: diffString == "ultimate" ? "ULT" : Difficulty[diffString],
            clear: icons.find(`img[src*="alljustice"]`).length ? "AJ" :
                icons.find(`img[src*="fullcombo"]`).length ? "FC" : ""
        }
    }).get() as RawChuniRecord[]
    return recentList.slice(0, 50)
}

export async function getOfficialR10() {
    const res = await fetch("https://chunithm-net-eng.com/mobile/home/playerData/ratingDetailRecent/")
    return $(await res.text()).find("form").map(function () {
        const songData = $(this)
        return {
            title: songData.find(".music_title")?.text(),
            score: parseNumber(songData.find(".text_b")?.text()),
            difficulty: Object.values(Difficulty)[Number.parseInt(songData.find("input[name=diff]")?.attr("value"))]
        }
    }).get() as RawChuniRecord[]
}

export async function fetchPlayCount(idx: string, diff: ChunirecDifficulty) {
    const fd = new FormData()
    fd.append("idx", idx)
    fd.append("genre", "99")
    fd.append("diff", Object.values(Difficulty).indexOf(diff).toString())
    fd.append("token", getCookie("_t"))
    const res = await fetch("https://chunithm-net-eng.com/mobile/record/musicGenre/sendMusicDetail/", {
        headers: { "Cache-Control": "no-cache" },
        method: "POST",
        body: fd
    })
    return Number.parseInt($(await res.text()).find(`.music_box.bg_${Object.keys(Difficulty).find(key => Difficulty[key] === diff)} .box14 > div`)
        .eq(1).find(".text_b").text().replace("times", ""))
}