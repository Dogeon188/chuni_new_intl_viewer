<script lang="ts">
    export let value: string
    export let label: string
    export let needReload = false
    let changed = false
</script>

<label>
    <span>
        {label}
        {#if needReload && changed}
            <span style="color:var(--theme-text_dim)">*require reload</span>
        {/if}
    </span>
    <select bind:value on:change={() => (changed = true)}>
        <slot />
    </select>
</label>

<style lang="sass">
    label
        display: flex
        flex-direction: column
        padding: .5rem
        gap: .5rem
    select
        width: 100%
        height: 3rem
        padding-left: 1rem
        padding-right: 2.5rem
        font-size: 1rem
        font-weight: bold
        background: var(--theme-bg_main)
        border: var(--theme-border) 2px solid
        border-radius: .5rem
        color: inherit
        cursor: pointer
        appearance: none
        background-image: linear-gradient(45deg,transparent 50%,currentColor 0),linear-gradient(135deg,currentColor 50%,transparent 0)
        background-position: calc(100% - 20px) calc(1px + 50%),calc(100% - 16.02px) calc(1px + 50%)
        background-size: 4px 4px,4px 4px
        background-repeat: no-repeat
</style>
