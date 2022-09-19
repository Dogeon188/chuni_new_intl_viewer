<script context="module">
    let playerStats = getPlayerStats()
</script>

<script lang="ts">
    import OverviewItem from "@/components/OverviewItem.svelte"
    import { getPlayerStats } from "@/utils/fetch"
    import { calcBestN, calcMaxPossible } from "@/utils/rating"
    import { floorAndToFixed2 } from "@/utils/utils"
    import { recordList, recentList, officialRecent } from "@/stores"
    export let isRecent = false
    $: ratingList = $recordList.map((s) => s.rating)
    $: recentRating = $recentList.map((s) => s.rating)
</script>

<div id="chuni-overview">
    {#await playerStats then stats}
        <h2 class="stats-name">{stats.name}</h2>
        <div class="stats-rating">
            <h2>{stats.rating}</h2>
            <span>MAX {stats.ratingMax}</span>
        </div>
        <div class="stats-honor" data-honor={stats.honor.type}>{stats.honor.text}</div>
    {/await}
    <div class="overview-items">
        <OverviewItem title="Generated at" content={new Date().toLocaleDateString()} />
        <OverviewItem
            title="Official R10"
            content={(
                $officialRecent.map((r) => r.rating).reduce((a, b) => a + b, 0) / 10
            ).toFixed(4)} />
        {#if isRecent}
            <OverviewItem
                title="Recent 10"
                content={calcBestN(recentRating, 10).toFixed(4)} />
            <OverviewItem
                title="Recent 30"
                content={calcBestN(recentRating, 30).toFixed(4)} />
        {:else}
            <OverviewItem
                title="Best 30"
                content={calcBestN(ratingList, 30).toFixed(4)} />
            <OverviewItem
                title="Max Possible"
                content={floorAndToFixed2(calcMaxPossible(ratingList))} />
        {/if}
    </div>
</div>

<style lang="sass">
    div#chuni-overview
        border: var(--theme-border) 3px solid
        border-radius: 0.5rem
        background-color: var(--theme-bg_sub)
        width: fit-content
        padding: 0.5rem
        margin: 0.5rem
        display: grid
        align-items: center
        width: calc(100% - 2rem - 6px)
        .stats-name
            grid-column: 1
            width: max-content
            justify-self: center
        .stats-rating
            grid-column: 2
            justify-self: center
            display: flex
            flex-direction: column
            gap: .5rem
            h2
                display: inline
                margin: 0
            span
                color: var(--theme-text_dim)
        .stats-honor
            grid-area: 2/1/3/3
            color: var(--theme-honor_normal)
            background: var(--theme-bg_main)
            border-radius: 3px
            padding: 5px
            margin: 0 20px
            font-weight: bold
            @each $t in ("normal", "bronze", "silver", "gold", "platina", "rainbow")
                &[data-honor=#{$t}]
                    color: var(--theme-honor_#{$t})
        .overview-items
            width: fit-content
            display: grid
            grid-area: 1/3/3/4
            gap: 5px
            padding: 5px
</style>
