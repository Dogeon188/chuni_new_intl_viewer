<script lang="ts">
    import OverviewItem from "./OverviewItem.svelte"
    import { getOfficialR10, getPlayerStats } from "../utils/fetch"
    export let b30: number
    export let maxPossible: number
</script>

<div id="chuni-overview">
    {#await getPlayerStats() then stats}
        <h2 class="stats-name">{stats.name}</h2>
        <h2 class="stats-rating">{stats.rating}</h2>
        <div class="stats-honor stats-honor-{stats.honor.type}">{stats.honor.text}</div>
    {/await}
    <div class="overview-items">
        <OverviewItem title="Generated at" content={new Date().toLocaleDateString()} />
        <OverviewItem title="Best 30 AVG" content={b30.toFixed(2)} />
        {#await getOfficialR10() then r10}
            <OverviewItem title="Recent 10 AVG" content={r10.toFixed(2)} />
        {/await}
        <OverviewItem title="Max Possible" content={maxPossible.toFixed(2)} />
    </div>
</div>

<style lang="sass">
    div#chuni-overview
        border: #547 3px solid
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
            grid-area: 2/1/3/3
            color: #998
            background: #113
            border-radius: 3px
            padding: 5px
            margin: 0 20px
            @each $t, $tc in ("normal": #998, "bronze": #d83, "silver": #ddd, "gold": #fb4, "rainbow": #6e8)
                &.stats-honor-#{$t}
                    color: $tc
        .overview-items
            width: fit-content
            display: grid
            grid-area: 1/3/3/4
            gap: 5px
            padding: 5px
</style>