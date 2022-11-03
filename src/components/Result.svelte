<script lang="ts">
    import {
        sortBy,
        filterConstMin,
        filterConstMax,
        showPlayCount,
        filterDiff,
        showOp,
    } from "@/config"
    import { recordList, recentList, officialRecent, shownTab } from "@/stores"
    import RankCounter from "./RankCounter.svelte"
    import RecordItem from "./RecordItem.svelte"

    $: isRecent = $shownTab == "recent"

    const sorts: Record<string, (a: ChuniRecord, b: ChuniRecord) => number> = {
        rating: (a, b) => a.order - b.order,
        score: (a, b) => b.score - a.score,
        op: (a, b) => b.op - a.op,
        opp: (a, b) => b.op / b.opmax - a.op / a.opmax,
        const: (a, b) => b.const - a.const,
        title: (a, b) => {
            if (a.title < b.title) return -1
            if (a.title > b.title) return 1
            const diffs = ["ULT", "MAS", "EXP", "ADV", "BAS"]
            return diffs.indexOf(b.difficulty) - diffs.indexOf(a.difficulty)
        },
        aj: (a, b) => {
            if (a.clear == b.clear) return a.order - b.order
            const clears = ["", "FC", "AJ"]
            return clears.indexOf(b.clear) - clears.indexOf(a.clear)
        },
        play: (a, b) => {
            if (a.playCount == undefined) return 100
            if (b.playCount == undefined) return -100
            if (a.playCount == b.playCount) return a.order - b.order
            return b.playCount - a.playCount
        },
    }
    $: filteredList = isRecent
        ? $recentList
        : $recordList.filter((v, i) => {
              const diff = ["BAS", "ADV", "EXP", "MAS", "ULT"]
              return (
                  v.difficulty == "WE" ||
                  ($filterDiff[diff.indexOf(v.difficulty)] &&
                      $filterConstMax >= v.const &&
                      v.const >= $filterConstMin)
              )
          })
    $: sortedList = filteredList.sort(sorts[$sortBy])
    $: sortedOfficialRecent = $officialRecent.sort(sorts[$sortBy])
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
