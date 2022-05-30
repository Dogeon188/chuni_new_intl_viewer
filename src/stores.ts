import { writable } from "svelte/store"
import { isMobile } from "./utils/utils"

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