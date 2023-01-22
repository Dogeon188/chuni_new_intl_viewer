<script lang="ts">
    import {
        sortBy,
        filterConstMin,
        filterConstMax,
        showPlayCount,
        filterDiff,
        showOp,
        filterGenre,
    } from "@/config"
    import { recordSorts, difficulties } from "@/utils/fetch"
    import { recordList, recentList, officialRecent, shownTab } from "@/stores"
    import RankCounter from "./RankCounter.svelte"
    import RecordItem from "./RecordItem.svelte"

    $: isRecent = $shownTab == "recent"
    $: filteredList = isRecent
        ? $recentList
        : $recordList.filter((v, i) => {
              return (
                  $filterDiff[difficulties.indexOf(v.difficulty)] &&
                  $filterGenre[v.genre] &&
                  $filterConstMax >= v.const &&
                  v.const >= $filterConstMin
              )
          })
    $: sortedList = filteredList.sort(recordSorts[$sortBy])
    $: sortedOfficialRecent = $officialRecent.sort(recordSorts[$sortBy])
    $: rankCounts = (() => {
        let rs = {} as Record<string, number>
        ;["MAX", "SSS+", "SSS", "SS+", "SS", "S+", "S"].forEach((e) => (rs[e] = 0))
        ;["AAA", "AA", "A", "BBB", "BB", "B", "C", "D"].forEach((e) => (rs[e] = 0))
        for (const r of filteredList) rs[r.rank]++
        Object.keys(rs).reduce((pre, cur) => ((rs[cur] += rs[pre]), cur))
        return rs
    })()
    $: ajCount = filteredList.filter((v) => v.clear == "AJ").length
    $: fcCount = ajCount + filteredList.filter((v) => v.clear == "FC").length
</script>

{#if $shownTab == "best"}
    <RankCounter {rankCounts} total={filteredList.length} {fcCount} {ajCount} />
{/if}
<table>
    <thead>
        <tr>
            <th on:click={() => ($sortBy = "rating")}>#</th>
            <th
                class:current-sort={"title" == $sortBy}
                on:click={() => ($sortBy = "title")}>Title</th>
            <th
                class:current-sort={"const" == $sortBy}
                on:click={() => ($sortBy = "const")}>Const</th>
            {#if $showOp}
                <th class:current-sort={"op" == $sortBy} on:click={() => ($sortBy = "op")}
                    >OP</th>
                <th
                    class:current-sort={"opp" == $sortBy}
                    on:click={() => ($sortBy = "opp")}>OP%</th>
            {:else}
                <th
                    class:current-sort={"score" == $sortBy}
                    on:click={() => ($sortBy = "score")}>Rank</th>
                <th
                    class:current-sort={"score" == $sortBy}
                    on:click={() => ($sortBy = "score")}>Score</th>
            {/if}
            <th
                class:current-sort={"rating" == $sortBy}
                on:click={() => ($sortBy = "rating")}>Rating</th>
            <th class:current-sort={"aj" == $sortBy} on:click={() => ($sortBy = "aj")}
                >AJ</th>
            {#if $showPlayCount && !isRecent}
                <th
                    class:current-sort={"play" == $sortBy}
                    on:click={() => ($sortBy = "play")}>Play</th>
            {/if}
        </tr>
    </thead>
    <tbody>
        {#if isRecent}
            <td colspan="6" class="r-title">Official Recent 10</td>
            {#each sortedOfficialRecent as song}
                <RecordItem {song} isOfficialRecent />
            {/each}
            <td colspan="6" class="r-title">Play History R50</td>
        {/if}
        {#each sortedList as song}
            <RecordItem {song} />
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
    th
        padding: 0.5rem
        color: var(--theme-text_dim)
        cursor: pointer
    th.current-sort
        color: inherit
    td.r-title
        font-weight: bold
        color: var(--theme-label)
</style>
