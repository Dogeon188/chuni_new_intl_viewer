<script lang="ts">
    export let recordList: ChuniRecord[]

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
</script>

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
                <td data-diff="{song.difficulty}">{song.title}</td>
                <td>{song.const?.toFixed(1) ?? "??.?"}</td>
                <td>{song.score}</td>
                <td>{song.rating?.toFixed(2) ?? "??.??"}</td>
                <td data-clear="{song.clear}">{song.clear}</td>
            </tr>
        {/each}
    </tbody>
</table>

<style lang="sass">
    table
        border-spacing: 0
        width: 100%
        padding-bottom: 0.5rem
        max-width: max-content
        margin: auto
    td, th
        padding: 0.5rem
    td
        border-top: #436 2px solid
    th
        color: #aac
    th.current-sort
        color: #eec
    tbody
        tr.best30 td:first-child
            color: #fc4
        tr.best40 td:first-child
            font-weight: bold
        tr:not(.best40) td:first-child
            color: #ccc
        tr td:nth-child(2)
            font-weight: bold
            text-align: left
            max-width: 300px
            @each $diff, $diffc in ("ULT": #3cf, "MAS": #e9f, "EXP": #e46, "ADV": #e73, "BAS": #1c3)
                &[data-diff="#{$diff}"]
                    color: $diffc
        tr td:nth-child(6)
            font-weight: bold
            &[data-clear="FC"]
                color: #5e7
            &[data-clear="AJ"]
                color: #fc1
</style>
