import { writable } from "svelte/store"
import { isMobile } from "./utils/utils"

function createToggleable(b: boolean = false) {
    const { subscribe, set, update } = writable(b)
    return {
        subscribe,
        set,
        toggle: () => update(b => !b)
    }
}

export const msgText = writable("")
export const sortBy = writable("Rating")
export const filterB40 = createToggleable(isMobile())
export const showConfig = createToggleable()