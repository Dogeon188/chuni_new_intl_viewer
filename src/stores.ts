import { writable } from "svelte/store"
import { isMobile } from "./utils/utils"
import { setRootColors } from "./utils/utils"
import { themes } from "./themes"

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

if (localStorage.CV_theme == null) localStorage.CV_theme = "Dark"
if (localStorage.CV_filterB40 == null) localStorage.CV_filterB40 = isMobile()
if (localStorage.CV_sortBy == null) localStorage.CV_sortBy = "Rating"

export const msgText = writable("")

export const filterB40 = createToggleable(JSON.parse(localStorage.CV_filterB40), cur => {
    if (cur) sortBy.set("Rating")
    localStorage.CV_filterB40 = cur
})

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

export const sortBy = (() => {
    const { subscribe, set, update } = writable(localStorage.CV_sortBy)
    return {
        subscribe,
        set(sort: string) {
            set(sort)
            localStorage.CV_sortBy = sort
            if (sort != "Rating") filterB40.set(false)
        },
        update
    }
})()

export const showConfig = createToggleable()