import { get, writable } from "svelte/store"
import { fetchRawRecord, parseRecords, getSongList, fetchRecent, getOfficialR10 } from "@/utils/fetch"
import { filterDiff } from "@/config"

function createToggleable(dft = false) {
    const { subscribe, set, update } = writable(dft)
    return {
        subscribe,
        set,
        toggle() { update(b => !b) }
    }
}

export const msgText = writable("")

export const showConfig = createToggleable()

export const shownTab = writable("best" as ShownTabs)

export const errorFetching = writable(false)

export const fetchingPlayCount = writable(false)

export const officialRecent = (() => {
    const { subscribe, set } = writable([] as ChuniRecord[])

    let inited = false
    let raw = [] as RawChuniRecord[]

    return {
        set,
        subscribe,
        async init() {
            raw = await getOfficialR10()
            set(await parseRecords(raw))
            inited = true
        },
        async updateConstData() {
            if (!inited) return
            set(await parseRecords(raw))
        }
    }
})()

export const recentList = (() => {
    const { subscribe, set } = writable([] as ChuniRecord[])

    let inited = false
    let raw = [] as RawChuniRecord[]

    return {
        set,
        subscribe,
        async init() {
            raw = await fetchRecent()
            set(await parseRecords(raw))
            inited = true
        },
        async updateConstData() {
            if (!inited) return
            set(await parseRecords(raw))
        }
    }
})()

export const recordList = (() => {
    const { subscribe, set } = writable([] as ChuniRecord[])

    let inited = false
    let diffFetched: boolean[]
    let raw = [] as RawChuniRecord[]

    return {
        set,
        subscribe,
        async init() {
            raw = await fetchRawRecord()
            set(await parseRecords(raw))
            diffFetched = Array.from(get(filterDiff))
            inited = true
        },
        async updateConstData() {
            if (!inited) return
            set(await parseRecords(raw))
        },
        async updateDiffFilter(diffFilter: boolean[]) {
            if (!inited) return
            let fetchedAdditional = false
            for (let i = 0; i < 5; i++) {
                if (!diffFetched[i] && diffFilter[i]) {
                    Array.prototype.push.apply(raw, await getSongList(
                        (["BAS", "ADV", "EXP", "MAS", "ULT"] as ChunirecDifficulty[])[i]))
                    diffFetched[i] = true
                    fetchedAdditional = true
                }
            }
            if (fetchedAdditional) set(await parseRecords(raw))
        }
    }
})()