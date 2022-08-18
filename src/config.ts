import { writable } from "svelte/store"
import { isMobile, setRootColors } from "@/utils/utils"
import { themeNames, themes } from "@/themes"
import { officialRecent, recentList, recordList } from "@/stores"

function createStored<T>(key: string, dft: T, kwargs: {
    onWrite?: (cur: T) => any,
    accept?: T[]
} = {}) {
    const { onWrite = (cur: T) => { }, accept = [] } = kwargs

    let local = localStorage[key]
    let val

    if (local == undefined) localStorage[key] = dft

    switch (typeof dft) {
        case "string":
            if (!accept.includes(local)) local = dft
            val = local
            break
        case "number":
            if (isNaN(parseFloat(local)) || local < accept[0] || local > accept[1]) local = dft
            val = parseFloat(local)
            break
        case "boolean":
            if (local != "true" && local != "false") local = dft
            val = JSON.parse(local)
            break
        default:
            if (Array.isArray(dft)) val = JSON.parse("[" + local + "]")
            break
    }

    localStorage[key] = local

    const { subscribe, set, update } = writable(val)

    function _set(value: T) {
        set(Array.isArray(dft) ? Array.from(value) : value)
        localStorage[key] = value
        onWrite(value)
    }

    return {
        subscribe,
        set: _set,
        update,
        reset() { _set(dft) },
        toggle() { update(b => !b) }
    } as StoredWritable<T>
}

export const filterB40 = createStored(
    "CV_filterB40",
    isMobile()
)

export const sortBy = createStored(
    "CV_sortBy",
    "Rating",
    { accept: ["Rating", "Score", "Const", "Title", "AJ", "Play"] })
if (localStorage.CV_sortBy == "Play") sortBy.set("Rating")

export const filterConstMin = createStored("CV_filterConstMin", 1, { accept: [1, 15.4] })
export const filterConstMax = createStored("CV_filterConstMax", 15.4, { accept: [1, 15.4] })

export const filterDiff = createStored("CV_filterDiff", [false, false, true, true, true], {
    onWrite(cur) {
        recordList.updateDiffFilter(cur)
    }
})

export const theme = createStored("CV_theme", "Dark" as ThemeNames, {
    onWrite(cur) { setRootColors(themes[cur]) },
    accept: themeNames
})

export const usedSongData = createStored(
    "CV_songData",
    "intl" as SongDataTypes,
    {
        accept: [/* "jp", */ "intl"],
        onWrite() {
            recordList.updateConstData()
            recentList.updateConstData()
            officialRecent.updateConstData()
        }
    })

export const showPlayCount = createStored("CV_showPlayCount", false)

export const configs = [filterB40, sortBy, filterConstMin, filterConstMax, filterDiff, theme, usedSongData, showPlayCount]