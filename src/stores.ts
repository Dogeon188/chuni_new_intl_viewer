import { get, writable } from "svelte/store"
import { fetchRawRecord, parseRecord, getSongList } from "@/utils/fetch"
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

export const errorFetching = writable(false)

export const fetchingPlayCount = writable(false)

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
            set(await parseRecord(raw))
            diffFetched = Array.from(get(filterDiff))
            inited = true
        },
        async updateConstData() {
            if (!inited) return
            set(await parseRecord(raw))
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
            if (fetchedAdditional) set(await parseRecord(raw))
        }
    }
})()