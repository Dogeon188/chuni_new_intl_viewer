<script lang="ts">
    export let rankCounts: Record<string, number>
    export let fcCount: number
    export let ajCount: number
</script>

<div class="container">
    {#each ["S", "S+", "SS", "SS+", "SSS", "SSS+"] as r}
        <div class="wrapper" class:zero={!(rankCounts[r] > 0)}>
            <div>{r}</div>
            <div>{rankCounts[r] ?? 0}</div>
        </div>
    {/each}
    <div class="wrapper mx" class:zero={!(rankCounts["MAX"] > 0)}>
        <div>MAX</div>
        <div>{rankCounts["MAX"] ?? 0}</div>
    </div>
    <div class="wrapper fc" class:zero={fcCount == 0}>
        <div>FC</div>
        <div>{fcCount}</div>
    </div>
    <div class="wrapper aj" class:zero={ajCount == 0}>
        <div>AJ</div>
        <div>{ajCount}</div>
    </div>
    <div class="total">/{rankCounts.total}</div>
</div>

<style lang="sass">
    div.container
        border: var(--theme-border) 3px solid
        border-radius: 0.5rem
        background-color: var(--theme-bg_sub)
        width: fit-content
        padding: 0.5rem
        margin: 0.5rem
        display: flex
        justify-content: space-evenly
        width: calc(100% - 2rem - 6px)
    div.wrapper
        gap: .3rem
        display: flex
        flex-direction: column
    div.wrapper
        div:nth-child(1)
            color: var(--theme-label)
        div:nth-child(2)
            font-size: 1.2rem
            font-weight: bold
        &.fc div:nth-child(1)
            color: var(--theme-clear_fc)
        &.aj div:nth-child(1)
            color: var(--theme-clear_aj)
        &.mx:not(.zero) div:nth-child(2)
            color: var(--theme-clear_aj)
            text-shadow: 0 0 10px var(--theme-clear_aj)
        &.zero div:nth-child(2)
            color: var(--theme-text_dim)
    div.total
        color: var(--theme-text_dim)
        font-size: .8rem
        display: flex
        align-items: end
</style>
