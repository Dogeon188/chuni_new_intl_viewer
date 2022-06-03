<script lang="ts">
    import {
        showConfig,
        sortBy,
        filterB40,
        theme,
        filterConstMin,
        filterConstMax,
    } from "@/stores"
    import { themeNames } from "@/themes"
    import Select from "@/components/Select.svelte"
    import ToggleSwitch from "@/components/ToggleSwitch.svelte"
    import DualSlider from "@/components/DualSlider.svelte"
</script>

<div class="modal-wrapper" class:hidden={!$showConfig}>
    <div class="modal-bg" on:click={showConfig.toggle} />
    <div class="modal">
        <div class="close-btn" on:click={showConfig.toggle}>✕</div>
        <h3>Options</h3>
        <div class="config-content">
            <Select label="Sort By" bind:value={$sortBy}>
                <option value="Rating">Rating</option>
                <option value="Score">Score</option>
                <option value="Const">Chart Constant</option>
                <option value="Title">Title</option>
                <option value="AJ">AJ&#xFF0F;FC</option>
            </Select>
            <ToggleSwitch label="Show Only B40" bind:checked={$filterB40} />
            <DualSlider
                label="Filter By Constant"
                max={15.4}
                min={1}
                bind:low={$filterConstMin}
                bind:high={$filterConstMax}
                step={0.1} />
            <Select label="Theme" bind:value={$theme}>
                {#each themeNames as t}
                    <option value={t}>{t}</option>
                {/each}
            </Select>
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
        max-width: 32rem
        max-height: 80%
        overflow-y: auto
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
    .close-btn
        position: absolute
        top: .5rem
        right: .5rem
        width: 2rem
        height: 2rem
        background-color: var(--theme-border)
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
