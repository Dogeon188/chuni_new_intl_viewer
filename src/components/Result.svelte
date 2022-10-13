<script lang="ts">
    import {
        sortBy,
        filterB40,
        filterConstMin,
        filterConstMax,
        showPlayCount,
        filterDiff,
    } from "@/config"
    import {
        recordList,
        recentList,
        msgText,
        fetchingPlayCount,
        officialRecent,
        shownTab,
    } from "@/stores"
    import RecordItem from "./RecordItem.svelte"

    $: isRecent = $shownTab == "recent"

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
            if (a.playCount == undefined) return 100
            if (b.playCount == undefined) return -100
            if (a.playCount == b.playCount) return a.rank - b.rank
            return b.playCount - a.playCount
        },
    }
    $: filteredList = (isRecent ? $recentList : $recordList).filter((v, i) => {
        const diff = ["BAS", "ADV", "EXP", "MAS", "ULT"]
        return (
            v.difficulty == "WE" ||
            ($filterDiff[diff.indexOf(v.difficulty)] &&
                (isRecent || !$filterB40 || i < 40) &&
                $filterConstMax >= v.const &&
                v.const >= $filterConstMin)
        )
    })
    $: sortedList = filteredList.sort(sorts[$sortBy])
    $: sortedOfficialRecent = $officialRecent.sort(sorts[$sortBy])
</script>

{#if $fetchingPlayCount}
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
            {#if $showPlayCount && !isRecent}
                <th
                    class:current-sort={"Play" == $sortBy}
                    on:click={() => ($sortBy = "Play")}>Play</th>
            {/if}
        </tr>
    </thead>
    <tbody>
        {#if isRecent}
        <td colspan="6" class="r-title">Official Recent 10</td>
            {#each sortedOfficialRecent as song}
                <RecordItem {song} isOfficialRecent/>
            {/each}
        <td colspan="6" class="r-title">Play History R50</td>
        {/if}
        {#each sortedList as song}
            <RecordItem {song} />
        {/each}
    </tbody>
</table>
{#if !isRecent && $filterB40}
    <div class="see-more" on:click={filterB40.toggle}>See more...</div>
{/if}

<style lang="sass">
    table
        border-spacing: 0
        width: 100%
        padding-bottom: 0.5rem
        max-width: max-content
        margin: auto
    th
        padding: 0.5rem
        color: var(--theme-text_dim)
        cursor: pointer
    th.current-sort
        color: inherit
    td.r-title
        font-weight: bold
        color: var(--theme-label)
    .see-more
        background-color: var(--theme-bg_sub)
        border-radius: .5rem
        padding: .5rem
        margin: .5rem 5rem
        text-align: center
        cursor: pointer
</style>
