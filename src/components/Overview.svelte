<script lang="ts">
    import OverviewItem from "./OverviewItem.svelte"
    export let b30: number
    export let maxAchievable: number
    export let playerStats: ChuniPlayerStats
</script>

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
            display: flex
            flex-direction: column
            grid-area: 1/3/3/3
</style>

<div id="chuni-overview">
    <h2 class="stats-name">{playerStats.name}</h2>
    <h3 class="stats-rating">{playerStats.rating}</h3>
    <div class="stats-honor stats-honor-{playerStats.honor.type}">{playerStats.honor.text}</div>
    <div class="overview-items">
        <OverviewItem title="Generated at" content={new Date().toLocaleDateString()} />
        <OverviewItem title="B30 Avg." content={b30.toFixed(2)} />
        <OverviewItem title="Max Rating" content={maxAchievable.toFixed(2)} />
    </div>
</div>
