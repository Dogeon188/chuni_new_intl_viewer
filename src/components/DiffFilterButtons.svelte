<script lang="ts">
    import DiffFilterButton from "@/components/DiffFilterButton.svelte"
    export let config: boolean[]
    let changed = false
</script>

<div class="wrapper">
    <span>
        Filter By Difficulty
        {#if changed}
            <span style="color:var(--theme-text_dim)">*require reload</span>
        {/if}
    </span>
    <div class="btns">
        {#each ["BAS", "ADV", "EXP", "MAS", "ULT"] as diff, i}
            <DiffFilterButton {diff} bind:checked={config[i]} />
        {/each}
    </div>
</div>

<style lang="sass">
    .wrapper   
        display: flex
        flex-direction: column
        padding: .5rem
        gap: .5rem
    .btns
        display: flex
        flex-direction: row
        gap: .5rem
</style>
