<script lang="ts">
    export let recordList: ChuniRecord[]

    import Overview from "./Overview.svelte"
    import { calcB30, calcMaxPossible } from "../utils/rating"
    import { sortBy, filterB40 } from "../stores"

    const sorts = {
        "Rating": (a: ChuniRecord, b: ChuniRecord) => a.rank - b.rank,
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
            const clears = ["", "FC", "AJ"]
            return clears.indexOf(b.clear) - clears.indexOf(a.clear)
        },
    }
    $: sortedList = recordList.sort(sorts[$sortBy])
    $: filteredList = $filterB40 ? sortedList.slice(0, 40) : sortedList

    const ratingList = recordList.map((s) => s.rating)
</script>

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
                        class:current-sort={h == $sortBy}
                        on:click={() => $sortBy = (h == "#" ? "Rating" : h)}>{h}</th>
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
