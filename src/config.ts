import { get, writable } from "svelte/store"
import { setRootColors } from "@/utils/utils"
import { themeNames, themes } from "@/themes"
import { officialRecent, recentList, recordList } from "@/stores"

function createStored<T>(key: string, defaultValue: T, kwargs: {
    onWrite?: (cur: T) => any,
    accept?: T[]
} = {}) {
    const { onWrite = (cur: T) => { }, accept = [] } = kwargs

    let local = localStorage[key]
    let value

    if (local == undefined) {
        localStorage[key] = defaultValue
        local = localStorage[key]
    }

    switch (typeof defaultValue) {
        case "string":
            if (!accept.includes(local)) local = defaultValue
            value = local
            break
        case "number":
            if (isNaN(parseFloat(local)) || local < accept[0] || local > accept[1]) local = defaultValue
            value = parseFloat(local)
            break
        case "boolean":
            if (local != "true" && local != "false") local = defaultValue
            value = JSON.parse(local)
            break
        default:
            if (Array.isArray(defaultValue)) value = JSON.parse("[" + local + "]")
            break
    }

    localStorage[key] = local

    const { subscribe, set, update } = writable(value)

    function _set(value: T) {
        set(Array.isArray(defaultValue) ? Array.from(value) : value)
        localStorage[key] = value
        onWrite(value)
    }

    return {
        subscribe,
        set: _set,
        update,
        reset() { _set(defaultValue) },
        toggle() { update(b => !b) }
    } as StoredWritable<T>
}

export const sortBy = createStored(
    "CV_sortBy",
    "rating",
    { accept: ["rating", "score", "op", "opp", "const", "title", "aj", "play"] })
if (localStorage.CV_sortBy == "Play") sortBy.set("Rating")

export const filterConstMin = createStored("CV_filterConstMin", 1, { accept: [1, 15.4] })
export const filterConstMax = createStored("CV_filterConstMax", 15.4, { accept: [1, 15.4] })

export const filterDiff = createStored(
    "CV_filterDiff",
    [false, false, true, true, true],
    { onWrite(cur) { recordList.updateDiffFilter(cur) } })

/*
POPS&ANIME: 0,
niconico: 2,
東方Project: 3,
ORIGINAL: 5,
VARIETY: 6,
イロドリミドリ: 7,
ゲキマイ: 9
*/
export const filterGenre = createStored(
    "CV_filterGenre",
    [true, false, true, true, false, true, true, true, false, true])

export const theme = createStored("CV_theme", "Dark" as ThemeNames, {
    onWrite(cur) { setRootColors(themes[cur]) },
    accept: themeNames
})

export const acceptedSongData = ["jp", "intl"]

export const usedSongData = createStored(
    "CV_songData",
    "intl" as SongDataTypes,
    {
        accept: acceptedSongData,
        onWrite() {
            recordList.updateConstData()
            recentList.updateConstData()
            officialRecent.updateConstData()
        }
    })

export const showPlayCount = createStored("CV_showPlayCount", false)

export const showOp = createStored("CV_showOp", false, {
    onWrite(cur) {
        if ((cur && get(sortBy) == "score") || (!cur && ["op", "opp"].includes(get(sortBy))))
            sortBy.reset()
    },
})

export const configs = [sortBy, filterConstMin, filterConstMax, filterDiff, theme, usedSongData, showPlayCount, showOp]