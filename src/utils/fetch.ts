import { get } from "svelte/store"
import { calcOp, calcOpMax, calcRank, calcRating } from "@/utils/rating"
import { getCookie, parseNumber } from "@/utils/utils"
import { errorFetching, msgText } from "@/stores"
import { filterDiff, usedSongData } from "@/config"

const Difficulty = {
    basic: "BAS",
    advanced: "ADV",
    expert: "EXP",
    master: "MAS",
    ultima: "ULT",
    worldsend: "WE"
} as Record<string, ChunirecDifficulty>

export const difficulties = Object.values(Difficulty).slice(0, -1)

const Genre = {
    "POPS&ANIME": 0,
    "niconico": 2,
    "東方Project": 3,
    "ORIGINAL": 5,
    "VARIETY": 6,
    "イロドリミドリ": 7,
    "ゲキマイ": 9,
    "ALL": 99
}
export const genres = Object.entries(Genre).slice(0, -1)

export const recordSorts: Record<string, (a: ChuniRecord, b: ChuniRecord) => number> = {
    default: (a, b) => b.rating - a.rating || b.const - a.const || a.score - b.score,
    rating: (a, b) => a.order - b.order,
    score: (a, b) => b.score - a.score,
    op: (a, b) => b.op - a.op,
    opp: (a, b) => b.op / b.opmax - a.op / a.opmax,
    const: (a, b) => b.const - a.const,
    title: (a, b) => {
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        return difficulties.indexOf(b.difficulty) - difficulties.indexOf(a.difficulty)
    },
    aj: (a, b) => {
        if (a.clear == b.clear) return a.order - b.order
        const clears = ["", "FC", "AJ"]
        return clears.indexOf(b.clear) - clears.indexOf(a.clear)
    },
    play: (a, b) => {
        if (a.playCount == undefined) return 100
        if (b.playCount == undefined) return -100
        if (a.playCount == b.playCount) return a.order - b.order
        return b.playCount - a.playCount
    },
}

async function getSongData() {
    return await fetch(`https://raw.githubusercontent.com/Dogeon188/chuni_new_intl_viewer/data/data/${get(usedSongData)}.json`).then(d => d.json())
}

export async function getSongList(diff: ChunirecDifficulty = Difficulty.master) {
    const fd = new FormData()
    fd.append("genre", Genre.ALL.toString())
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

    for (const [i, diff] of difficulties.entries()) {
        if (!get(filterDiff).at(i)) {
            continue
        }
        msgText.set(`Fetching ${diff} record...`)
        Array.prototype.push.apply(rawRecList, await getSongList(diff))
        if (get(errorFetching)) return []
    }

    return rawRecList
}

export async function parseRecords(rawRecord: RawChuniRecord[], isBestRec = false) {
    msgText.set("Fetching song data...")
    const musicData = await getSongData()
    const recordList = rawRecord as ChuniRecord[]
    if (get(errorFetching)) return []

    msgText.set("Calculating data...")
    const cannotFetch = [] as ChuniRecord[]
    recordList.map(r => {
        if (r.difficulty == Difficulty.worldsend) {
            r.const = -1
            r.rating = 0
            return
        }
        const songInfo = musicData[r.title]
        if (songInfo === undefined) {
            cannotFetch.push(r)
            r.const = 0
            r.rating = 0
            return
        }
        r.const = songInfo[r.difficulty]
        r.rating = calcRating(r)
        r.op = calcOp(r)
        r.opmax = calcOpMax(r)
        r.rank = calcRank(r.score)
        r.genre = songInfo.genre
    })
    if (isBestRec && cannotFetch.length) {
        alert("[chuni-intl-viewer] Found unknown song(s):\n" +
            cannotFetch.map(r => `    ${r.title} ${r.difficulty}`).join("\n") +
            "\nPlease contact the author at Twitter or Discord.")
    }
    recordList.sort(recordSorts.default)
    recordList.map((r, i) => { r.order = i + 1 })
    return recordList
}

export async function getPlayerStats(): Promise<ChuniPlayerStats> {
    const res = await fetch(`https://chunithm-net-eng.com/mobile/home/playerData`)
    const statsPage = $(await res.text())
    const rating = [...statsPage.find(".player_rating_num_block img")].map(i => {
        const imgSrc = i.getAttribute("src") ?? ""
        if (/rating_.*_comma.png/.test(imgSrc)) return "."
        let num = (/rating_.*_[0-9]*(?=\.png)/g.exec(imgSrc) ?? ["**.**"])[0]
        return num.slice(-1)
    }
    ).join("")
    const honorBg = statsPage.find(".player_honor_short").css("background-image")
    return {
        name: statsPage.find(".player_name_in")[0].innerHTML,
        honor: {
            text: statsPage.find(".player_honor_text_view span")[0].innerHTML,
            type: (/honor_bg_.*(?=\.png)/.exec(honorBg) ?? ["normal"])[0].slice(9)
        },
        rating,
        ratingMax: statsPage.find(".player_rating_max")[0].innerHTML,
        totalPlayCount: statsPage.find(".user_data_play_count .user_data_text")[0].innerHTML
    }
}

export async function fetchRecent() {
    const res = await fetch("https://chunithm-net-eng.com/mobile/record/playlog")
    const recentList = $(await res.text()).find(".mt_10 .frame02.w400").map(function () {
        const songData: JQuery = $(this)
        const icons = songData.find(".play_musicdata_icon")
        const diffString = /musiclevel_.*(?=\.png)/.exec(
            songData.find(".play_track_result img").attr("src")!)![0].slice(11)
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
            difficulty: Object.values(Difficulty)[Number.parseInt(songData.find("input[name=diff]")?.attr("value")!)],
            clear: "-"
        }
    }).get() as RawChuniRecord[]
}

export async function fetchPlayCount(idx: string, diff: ChunirecDifficulty) {
    const fd = new FormData()
    fd.append("idx", idx)
    fd.append("genre", Genre.ALL.toString())
    fd.append("diff", difficulties.indexOf(diff).toString())
    fd.append("token", getCookie("_t"))
    const res = await fetch("https://chunithm-net-eng.com/mobile/record/musicGenre/sendMusicDetail/", {
        headers: { "Cache-Control": "no-cache" },
        method: "POST",
        body: fd
    })
    return Number.parseInt($(await res.text()).find(`.music_box.bg_${difficulties.find(key => Difficulty[key] === diff)} .box14 > div`)
        .eq(1).find(".text_b").text().replace("times", ""))
}