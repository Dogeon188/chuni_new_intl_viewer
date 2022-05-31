import { writable } from "svelte/store"
import { isMobile } from "./utils/utils"
import { setRootColors } from "./utils/utils"
import { themes } from "./themes"

function createToggleable(dft = false, onToggle = (cur: boolean) => {}) {
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

export const msgText = writable("")
export const filterB40 = createToggleable(isMobile(), cur => {
    if (cur) sortBy.set("Rating")
})
export const theme = (() => {
    if (localStorage.CV_theme == null) localStorage.CV_theme = "Dark"
    const {subscribe, set, update} = writable(localStorage.CV_theme as ThemeNames)
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
    const {subscribe, set, update} = writable("Rating")
    return {
        subscribe,
        set(sort: string) {
            set(sort)
            if (sort != "Rating") filterB40.set(false)
        },
        update
    }
})()
export const showConfig = createToggleable()