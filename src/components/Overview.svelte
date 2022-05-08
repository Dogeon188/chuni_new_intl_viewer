<script lang="ts">
    import OverviewItem from "./OverviewItem.svelte"
    export let b30: number
    export let maxAchievable: number
</script>

<style lang="sass">
    div
        border: #436 3px solid
        border-radius: 0.5rem
        background-color: #224
        width: fit-content
        padding: 0.5rem
        margin: 0.5rem
        text-align: center // left

        display: flex
        justify-content: space-around
        width: calc(100% - 2rem - 6px)
</style>

<div>
    <OverviewItem title="Generated at" content={new Date().toLocaleDateString()} />
    <OverviewItem title="B30 Avg." content={b30.toFixed(2)} />
    <OverviewItem title="Max Achievable" content={maxAchievable.toFixed(2)} />
</div>
