<script lang="ts">
    import { get } from "svelte/store"
    import {
        sortBy,
        filterB40,
        filterConstMin,
        filterConstMax,
        showPlayCount,
        filterDiff,
    } from "@/config"
    import { msgText, recordList } from "@/stores"
    import { getPlayCounts } from "@/utils/fetch"

    const sorts: Record<string, (a: ChuniRecord, b: ChuniRecord) => number> = {
        Rating: (a, b) => a.rank - b.rank,
        Score: (a, b) => b.score - a.score,
        Const: (a, b) => b.const - a.const,
        Title: (a, b) => {
            if (a.title < b.title) return -1
            if (a.title > b.title) return 1
            const diffs = ["ULT", "MAS", "EXP", "ADV", "BAS"]
            return diffs.indexOf(b.difficulty) - diffs.indexOf(a.difficulty)
        },
        AJ: (a, b) => {
            if (a.clear == b.clear) return a.rank - b.rank
            const clears = ["", "FC", "AJ"]
            return clears.indexOf(b.clear) - clears.indexOf(a.clear)
        },
        Play: (a, b) => {
            if (
                a.playCount == b.playCount ||
                a.playCount == undefined ||
                b.playCount == undefined
            )
                return a.rank - b.rank
            return b.playCount - a.playCount
        },
    }
    let fetchingPlayCount = get(showPlayCount) != "0"
    if ($showPlayCount) {
        getPlayCounts($recordList, parseInt(get(showPlayCount))).then(() => {
            fetchingPlayCount = false
        })
    }
    $: sortedList = $recordList.sort(sorts[$sortBy])
    $: filteredList = sortedList.filter((v, i) => {
        const diff = ["BAS", "ADV", "EXP", "MAS", "ULT"]
        return (
            $filterDiff[diff.indexOf(v.difficulty)] &&
            (!$filterB40 || i < 40) &&
            $filterConstMax >= v.const &&
            v.const >= $filterConstMin
        )
    })
</script>

{#if fetchingPlayCount}
    <span style="text-align:center;color:var(--theme-text_dim);">{$msgText}</span>
{/if}
<table>
    <thead>
        <tr>
            <th on:click={() => ($sortBy = "Rating")}>#</th>
            {#each ["Title", "Const", "Score", "Rating", "AJ"] as h}
                <th class:current-sort={h == $sortBy} on:click={() => ($sortBy = h)}
                    >{h}</th>
            {/each}
            {#if get(showPlayCount) != "0"}
                <th
                    class:current-sort={"Play" == $sortBy}
                    on:click={() => {
                        if (!fetchingPlayCount) $sortBy = "Play"
                    }}>Play</th>
            {/if}
        </tr>
    </thead>
    <tbody>
        {#each filteredList as song}
            <tr class:best30={song.rank <= 30} class:best40={song.rank <= 40}>
                <td>{song.rank}</td>
                <td data-diff={song.difficulty}>{song.title}</td>
                <td>{song.const?.toFixed(1) ?? "??.?"}</td>
                <td>{song.score}</td>
                <td>{song.rating == null ? "??.??" : song.rating.toFixed(2)}</td>
                <td data-clear={song.clear}>{song.clear}</td>
                {#if get(showPlayCount) != "0"}
                    <td>
                        {#if fetchingPlayCount}
                            ...
                        {:else}
                            {song.playCount ?? "..."}
                        {/if}
                    </td>
                {/if}
            </tr>
        {/each}
    </tbody>
</table>
{#if $filterB40}
    <div class="see-more" on:click={filterB40.toggle}>See more...</div>
{/if}

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
        border-top: var(--theme-border) 1.5px solid
    th
        color: var(--theme-text_dim)
        cursor: pointer
    th.current-sort
        color: inherit
    tbody
        tr.best30 td:first-child
            color: var(--theme-rank_b30)
        tr.best40 td:first-child
            font-weight: bold
        tr:not(.best40) td:first-child
            color: var(--theme-text_dim)
        tr td:nth-child(2)
            font-weight: bold
            text-align: left
            max-width: 300px
            @each $diff in ("ULT", "MAS", "EXP", "ADV", "BAS")
                &[data-diff="#{$diff}"]
                    color: var(--theme-song_#{to-lower-case($diff)})
        tr td:nth-child(6)
            font-weight: bold
            &[data-clear="FC"]
                color: var(--theme-clear_fc)
            &[data-clear="AJ"]
                color: var(--theme-clear_aj)
    .see-more
        background-color: var(--theme-bg_sub)
        border-radius: .5rem
        padding: .5rem
        margin: .5rem 5rem
        text-align: center
        cursor: pointer
</style>
