<script lang="ts">
    import { showConfig, recordList, msgText, showMsgText } from "@/stores"
    import { fetchPlayCount } from "@/utils/fetch"
    
    let from = 1, to = 40

    function invalidPlayCount(from: number, to: number) {
        return $showMsgText || isNaN(from) || isNaN(to) || from == null || to == null || to < from
    }

    async function fetchMultiPlayCount(from: number, to: number) {
        if (invalidPlayCount(from, to)) return
        $showMsgText = true
        $showConfig = false
        const l = $recordList.slice(from - 1, to).length
        for (const [i, song] of $recordList.slice(from - 1, to).entries()) {
            msgText.set(`Fetching play count... (${i}/${l})`)
            if (song.playCount != undefined) continue
            song.playCount = await fetchPlayCount(song.idx, song.difficulty)
        }
        recordList.set($recordList)
        $showMsgText = false
    }
</script>

<div class="wrapper">
    <div
        class="btn"
        class:disabled={invalidPlayCount(from, to)}
        on:click={() => fetchMultiPlayCount(from, to)}>
        Fetch
    </div>
    <input
        type="number"
        min="1"
        placeholder="from"
        bind:value={from}
        inputmode="numeric" />
    &#xFF5E;
    <input type="number" min="1" placeholder="to" bind:value={to} inputmode="numeric" />
</div>

<style lang="sass">
    .wrapper
        padding: .5rem
        display: flex
        gap: .5rem
        align-items: center
    input[type=number]
        background-color: var(--theme-bg_sub)
        color: var(--theme-text)
        border: none
        border-radius: .2rem
        width: 4rem
        padding: .5rem
        -moz-appearance: textfield
        flex-grow: 1
        &::-webkit-inner-spin-button
            -webkit-appearance: none
            margin: 0
    .btn
        width: fit-content
        padding: .5rem 1.5rem
        border-radius: .8rem
        font-weight: bold
        cursor: pointer
        user-select: none
        opacity: .9
        transition: .2s
        background-color: var(--theme-bg_control)
        &:hover
            opacity: 1
        &.disabled
            background-color: var(--theme-border)
            cursor: no-drop
</style>