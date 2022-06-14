import { writable } from "svelte/store"
import { isMobile, setRootColors } from "@/utils/utils"
import { themeNames, themes } from "@/themes"

function createToggleable(dft = false) {
    const { subscribe, set, update } = writable(dft)
    return {
        subscribe,
        set,
        toggle() { update(b => !b) }
    }
}

function createStored<T>(key: string, dft: T, kwargs: {
    onWrite?: (cur: T) => any,
    accept?: T[]
} = {}) {
    const { onWrite = (cur: T) => { }, accept = [] } = kwargs

    const local = localStorage[key]
    if (local == undefined
        || (typeof dft == "string" && !accept.includes(local))
        || (typeof dft == "number" && local < accept[0] || local > accept[1]))
        localStorage[key] = dft

    const { subscribe, set, update } = writable(
        (typeof dft == "number")
            ? parseFloat(localStorage[key])
            : (typeof dft == "boolean")
                ? JSON.parse(localStorage[key])
                : localStorage[key])
    function _set(value: T) {
        set(value)
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

export const msgText = writable("")

export const sortBy = createStored(
    "CV_sortBy",
    "Rating",
    {
        onWrite(sort) { if (sort != "Rating") filterB40.set(false) },
        accept: ["Rating", "Score", "Const", "Title", "AJ", "Play"]
    })
if (localStorage.CV_sortBy == "Play") sortBy.set("Rating")

export const usedSongData = createStored(
    "CV_songData",
    "intl" as SongDataTypes,
    { accept: ["jp", "intl"] })

export const filterB40 = createStored(
    "CV_filterB40",
    isMobile(),
    { onWrite(cur) { if (cur) sortBy.set("Rating") } }
)

export const showPlayCount = createStored("CV_showPlayCount", "0", { accept: ["0", "40", "100", "200", "-1"] })

export const filterConstMin = createStored("CV_filterConstMin", 1, { accept: [1, 15.4] })
export const filterConstMax = createStored("CV_filterConstMax", 15.4, { accept: [1, 15.4] })

export const theme = createStored("CV_theme", "Dark" as ThemeNames, {
    onWrite(cur) { setRootColors(themes[cur]) },
    accept: themeNames
})

export const configs = [sortBy, usedSongData, filterB40, showPlayCount, filterConstMin, filterConstMax, theme]

export const showConfig = createToggleable()