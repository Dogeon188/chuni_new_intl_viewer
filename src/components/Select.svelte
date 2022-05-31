<script lang="ts">
    export let value: string
</script>

<select bind:value>
    <slot />
</select>

<style lang="sass">
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
