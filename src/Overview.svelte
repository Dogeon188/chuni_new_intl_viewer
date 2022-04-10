<script lang="ts">
    import OverviewItem from "./OverviewItem.svelte"
    export let b30: number
    export let maxAchievable: number
    export let totalMasterScore: number
</script>

<style lang="sass">
    div
        border: #536 3px solid
        border-radius: 0.5rem
        background-color: #324
        width: fit-content
        padding: 0.5rem
        margin: 0.5rem
        text-align: left
</style>

<div>
    <OverviewItem title="Generated at" content={new Date().toLocaleDateString()}/>
    <OverviewItem title="Best 30 Avg." content={b30.toFixed(2)}/>
    <OverviewItem title="Max Achievable" content={maxAchievable.toFixed(2)}/>
    <OverviewItem title="Total MAS Score" content={totalMasterScore.toString()}/>
</div>