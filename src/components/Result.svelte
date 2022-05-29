<script lang="ts">
    export let recordList: ChuniRecord[]

    import Overview from "./Overview.svelte"
    import { saveResultAsPicture } from "../utils/share"
    import { calcB30, calcMaxPossible } from "../utils/rating"
    import { isMobile } from "../utils/utils"

    let filterb40 = isMobile()
    let sortBy = 0
    const sorts = {
        "Rating": (a: ChuniRecord, b: ChuniRecord) =>
            b.rating - a.rating || b.const - a.const || a.score - b.score,
        "Score": (a: ChuniRecord, b: ChuniRecord) => b.score - a.score,
        "Const": (a: ChuniRecord, b: ChuniRecord) => b.const - a.const,
        "Title": (a: ChuniRecord, b: ChuniRecord) => {
            if (a.title < b.title) return -1
            if (a.title > b.title) return 1
            const diffs = ["ULT", "MAS", "EXP", "ADV", "BAS"]
            return diffs.indexOf(b.difficulty) - diffs.indexOf(a.difficulty)
        },
        "AJ": (a: ChuniRecord, b: ChuniRecord) => {
            if (a.clear == b.clear) return a.rank - b.rank
            const clears = [null, "FC", "AJ"]
            return clears.indexOf(b.clear) - clears.indexOf(a.clear)
        },
    }
    $: sortedList = recordList.sort(Object.values(sorts)[sortBy])
    $: filteredList = filterb40 ? sortedList.slice(0, 40) : sortedList

    const ratingList = recordList.map((s) => s.rating)
</script>

<div class="buttons">
    <button
        class="filter"
        on:click={() => {
            filterb40 = !filterb40
            if (filterb40) sortBy = 0
        }}>
        {filterb40 ? "Show All" : "Show B40"}
    </button>
    <button
        class="sort"
        on:click={() => {
            sortBy = (sortBy + 1) % Object.keys(sorts).length
            filterb40 = false
        }}>
        Sort: {Object.keys(sorts)[sortBy]}
    </button>
    <button class="dl" on:click={() => saveResultAsPicture("b30")} disabled={sortBy != 0}>
        <i />Best 30
    </button>
    <button class="dl" on:click={() => saveResultAsPicture("b40")} disabled={sortBy != 0}>
        <i />Best 40
    </button>
</div>

<main>
    <Overview
        b30={calcB30(ratingList)}
        maxPossible={calcMaxPossible(ratingList)}
        />
    <table>
        <thead>
            <tr>
                {#each ["#", "Title", "Const", "Score", "Rating", "AJ"] as h}
                    <th
                        class:current-sort={h == Object.keys(sorts)[sortBy]}
                        on:click={() => {
                            let i = Object.keys(sorts).indexOf(h == "#" ? "Rating" : h)
                            if (i >= 0) sortBy = i
                            if (i > 0) filterb40 = false
                        }}>{h}</th>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each filteredList as song}
                <tr
                    class:best30 = {song.rank <= 30}
                    class:best40 = {song.rank <= 40}>
                    <td>{song.rank}</td>
                    <td class="diff-{song.difficulty.toLowerCase()}">{song.title}</td>
                    <td>{song.const?.toFixed(1) ?? "??.?"}</td>
                    <td>{song.score}</td>
                    <td>{song.rating?.toFixed(2) ?? "??.??"}</td>
                    <td>
                        {#if song.clear !== null}
                            <span class="clear-{song.clear?.toLowerCase()}">{song.clear}</span>
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</main>


<style lang="sass">
    main
        width: fit-content
        margin: auto
    button
        margin: 0.5rem
        padding: 0.3rem
        font-family: inherit
        font-weight: bold
        background-color: #324
        border: #536 3px solid
        color: #eec
        border-radius: 0.3rem
        cursor: pointer
        &:disabled
            cursor: default
            opacity: 0.5
        &.filter, &.sort
            border-color: #48c
            background-color: #159
        &.sort
            width: 7rem
        &.dl i
            background-image: url(https://raw.githubusercontent.com/Dogeon188/chuni_new_intl_viewer/main/assets/dl.png)
            display: inline-block
            width: 1rem
            height: 1rem
            background-position: 0px 0px
            background-size: cover
    table
        border-spacing: 0
        width: 100%
        padding-bottom: 0.5rem
        max-width: max-content
        margin: auto
    td, th
        padding: 0.5rem
    th
        color: #aac
    th.current-sort
        color: #eec
    tbody
        tr.best30 td:first-child
            color: #fc4
        tr.best40 td:first-child
            font-weight: bold
        tr:nth-child(odd)
            background-color: #224
        tr td:nth-child(2)
            overflow: hidden
            text-overflow: ellipsis
            font-weight: bold
            text-align: initial
            max-width: 300px
            @each $diff, $diffc in ("ult": #3cf, "mas": #e9f, "exp": #e46, "adv": #e73, "bas": #1c3)
                &.diff-#{$diff}
                    color: $diffc
    span.clear-fc
        color: #5e7
        font-weight: bold
    span.clear-aj
        color: #fc1
        font-weight: bold
</style>
