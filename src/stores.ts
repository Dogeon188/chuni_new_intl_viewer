import { Writable, writable } from "svelte/store"
import { isMobile, setRootColors } from "@/utils/utils"
import { themeNames, themes } from "@/themes"

function createToggleable(dft = false, onToggle = (cur: boolean) => { }) {
    const { subscribe, set, update } = writable(dft)
    return {
        subscribe,
        set(value: boolean) {
            set(value)
            onToggle(value)
        },
        toggle: () => update(b => {
            return !b
        })
    }
}

function createStoredWritable<T>(key: string, dft: T, onToggle = (cur: T) => { }) {
    localStorage[key] ??= dft
    const { subscribe, set, update } = writable((typeof dft == "number")
        ? parseFloat(localStorage[key])
        : localStorage[key])
    return {
        subscribe,
        set(value: T) {
            set(value)
            localStorage[key] = value
            onToggle(value)
        },
        update
    } as Writable<T>
}

export const msgText = writable("")

export const sortBy = createStoredWritable("CV_sortBy", "Rating", sort => {
    if (sort != "Rating") filterB40.set(false)
})
if (localStorage.CV_sortBy == "Play") sortBy.set("Rating")

export const usedSongData = createStoredWritable("CV_songData", "intl" as SongDataTypes)

localStorage.CV_filterB40 ??= isMobile()
export const filterB40 = createToggleable(JSON.parse(localStorage.CV_filterB40), cur => {
    if (cur) sortBy.set("Rating")
    localStorage.CV_filterB40 = cur
})

localStorage.CV_showPlayCount ??= false
export const showPlayCount = createToggleable(JSON.parse(localStorage.CV_showPlayCount), cur => {
    localStorage.CV_showPlayCount = cur
})

export const filterConstMin = createStoredWritable("CV_filterConstMin", 1)
export const filterConstMax = createStoredWritable("CV_filterConstMax", 15.4)

if (!themeNames.includes(localStorage.CV_theme)) localStorage.CV_theme = "Dark"
export const theme = (() => {
    const { subscribe, set, update } = writable(localStorage.CV_theme as ThemeNames)
    return {
        subscribe,
        set(theme: ThemeNames) {
            set(theme)
            setRootColors(themes[theme])
            localStorage.CV_theme = theme
        },
        update
    }
})()

export const showConfig = createToggleable()