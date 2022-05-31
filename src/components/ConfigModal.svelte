<script lang="ts">
    import { showConfig, sortBy, filterB40, theme } from "../stores"
    import { themeNames } from "../themes"
    import ToggleSwitch from "./ToggleSwitch.svelte"
</script>

<div class="modal-wrapper" class:hidden={!$showConfig}>
    <div class="modal-bg" on:click={showConfig.toggle} />
    <div class="modal">
        <div class="close-btn" on:click={showConfig.toggle}>✕</div>
        <h3>Options</h3>
        <div class="config-content">
            <label>
                <span>Sort By</span>
                <select bind:value={$sortBy}>
                    <option value="Rating" selected>Rating</option>
                    <option value="Score">Score</option>
                    <option value="Const">Chart Constant</option>
                    <option value="Title">Title</option>
                    <option value="AJ">AJ&#xFF0F;FC</option>
                </select>
            </label>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>
                <span>Show Only B40</span>
                <ToggleSwitch bind:checked={$filterB40}/>
            </label>
            <label>
                <span>Theme</span>
                <select bind:value={$theme}>
                    {#each themeNames as t}
                        <option value={t}>{t}</option>
                    {/each}
                </select>
            </label>
            <!-- <label>
                <span>Filter By</span>
                Constant
                B40
                Difficulty
            </label> -->
        </div>
    </div>
</div>

<style lang="sass">
    .modal-wrapper
        position: fixed
        top: 0
        left: 0
        width: 100vw
        height: 100vh
        display: flex
        align-items: center
        &.hidden
            display: none
    .modal-bg
        position: fixed
        background: #0006
        top: 0
        left: 0
        width: 100vw
        height: 100vh
    .modal
        background: var(--theme-bg_main)
        width: 70%
        margin: auto
        padding: 2rem
        position: relative
        box-shadow: 2rem 2rem 10px #0008
        border-radius: 1rem
        text-align: left
    h3
        margin: 0
    .config-content
        padding: 5px
    label
        display: flex
        padding: .5rem
        flex-direction: column
        gap: .5rem
    select
        width: 100%
        padding: .75rem
        background: var(--theme-bg_main)
        border: var(--theme-border) 2px solid
        border-radius: .5rem
        color: inherit
        cursor: pointer
        text-align: left
        appearance: none
    .close-btn
        position: absolute
        top: .5rem
        right: .5rem
        width: 2rem
        height: 2rem
        background-color: var(--theme-bg_sub)
        border-radius: 50%
        display: inline-flex
        justify-content: center
        align-items: center
        opacity: 0.6
        transition-duration: 0.2s
        cursor: pointer
        &:hover
            opacity: 0.9
</style>