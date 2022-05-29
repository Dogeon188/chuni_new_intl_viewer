<script lang="ts">
    import OverviewItem from "./OverviewItem.svelte"
    import { getOfficialR10, getPlayerStats } from "../utils/fetch"
    export let b30: number
    export let maxPossible: number

    let officialR10 = getOfficialR10()
    let playerStats = getPlayerStats()
</script>

<div id="chuni-overview">
    {#await playerStats then stats}
        <h2 class="stats-name">{stats.name}</h2>
        <h2 class="stats-rating">{stats.rating}</h2>
        <div class="stats-honor stats-honor-{stats.honor.type}">{stats.honor.text}</div>
    {/await}
    <div class="overview-items">
        <OverviewItem title="Generated at" content={new Date().toLocaleDateString()} />
        <OverviewItem title="B30 Avg" content={b30.toFixed(2)} />
        {#await officialR10 then r10}
            <OverviewItem title="R10 Avg" content={r10.toFixed(2)} />
        {/await}
        <OverviewItem title="Max Possible" content={maxPossible.toFixed(2)} />
    </div>
</div>

<style lang="sass">
    div#chuni-overview
        border: #436 3px solid
        border-radius: 0.5rem
        background-color: #224
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
            grid-area: 2/1/2/3
            color: #998
            background: #113
            border-radius: 3px
            padding: 5px
            margin: 0 20px
            @each $t, $tc in ("normal": #998, "bronze": #d83, "silver": #ddd, "gold": #fb4, "rainbow": #6e8)
                &.stats-honor-#{$t}
                    color: $tc
        .overview-items
            display: grid
            grid-area: 1/3/3/3
            gap: 5px
            padding: 5px
</style>