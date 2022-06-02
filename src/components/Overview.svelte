<script lang="ts">
    import OverviewItem from "@/components/OverviewItem.svelte"
    import { getOfficialR10, getPlayerStats } from "@/utils/fetch"
    import { calcB30, calcMaxPossible } from "@/utils/rating"
    import { floorAndToFixed2 } from "@/utils/utils"
    export let ratingList: number[]
</script>

<div id="chuni-overview">
    {#await getPlayerStats() then stats}
        <h2 class="stats-name">{stats.name}</h2>
        <h2 class="stats-rating">{stats.rating}</h2>
        <div class="stats-honor" data-honor={stats.honor.type}>{stats.honor.text}</div>
    {/await}
    <div class="overview-items">
        <OverviewItem title="Generated at" content={new Date().toLocaleDateString()} />
        <OverviewItem title="Best 30 AVG" content={calcB30(ratingList).toFixed(4)} />
        {#await getOfficialR10() then r10}
            <OverviewItem title="Recent 10 AVG" content={r10.toFixed(4)} />
        {/await}
        <OverviewItem
            title="Max Possible"
            content={floorAndToFixed2(calcMaxPossible(ratingList))} />
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
