<script lang="ts">
    import {
        showConfig,
        sortBy,
        filterB40,
        theme,
        filterConstMin,
        filterConstMax,
        usedSongData,
        showPlayCount,
        configs,
        filterDiff,
    } from "@/stores"
    import { themeNames } from "@/themes"
    import Select from "@/components/Select.svelte"
    import ToggleSwitch from "@/components/ToggleSwitch.svelte"
    import DualSlider from "@/components/DualSlider.svelte"
    import DiffFilterButtons from "./DiffFilterButtons.svelte"
</script>

<div class="modal-wrapper" class:hidden={!$showConfig}>
    <div class="modal-bg" on:click={showConfig.toggle} />
    <div class="modal">
        <div class="close-btn" on:click={showConfig.toggle}>✕</div>
        <h3>Options</h3>
        <div class="config-content">
            <h4>Sort & Filter</h4>
            <div>
                <ToggleSwitch label="Show Only B40" bind:checked={$filterB40} />
                <Select label="Sort By" bind:value={$sortBy}>
                    <option value="Rating">Rating</option>
                    <option value="Score">Score</option>
                    <option value="Const">Chart Constant</option>
                    <option value="Title">Title</option>
                    <option value="AJ">AJ&#xFF0F;FC</option>
                    <option value="Play">Play Count</option>
                </Select>
                <DualSlider
                    label="Filter By Constant"
                    max={15.4}
                    min={1}
                    bind:low={$filterConstMin}
                    bind:high={$filterConstMax}
                    step={0.1} />
                <DiffFilterButtons bind:config={$filterDiff} />
            </div>
            <hr />
            <h4>General</h4>
            <div>
                <Select label="Theme" bind:value={$theme}>
                    {#each themeNames as t}
                        <option value={t}>{t}</option>
                    {/each}
                </Select>
                <Select label="Song Data to Use" bind:value={$usedSongData} needReload>
                    <option value="intl">Internation Ver.</option>
                    <option value="jp">Japanese ver. (NEW+)</option>
                </Select>
                <Select label="Show Play Count" bind:value={$showPlayCount} needReload>
                    <option value="0">Don't show</option>
                    <option value="40">Show for best 40</option>
                    <option value="100">Show for best 100</option>
                    <option value="200">Show for best 200</option>
                    <option value="400">Show for best 400</option>
                    <option value="-1">Show all (Cost long time & large data)</option>
                </Select>
            </div>
        </div>
        <hr/>
        <div
            class="reset-btn"
            on:click={() => {
                localStorage.clear()
                for (const config of configs) config.reset()
            }}>
            Reset Settings
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
    h4
        margin: .5rem 0
        color: var(--theme-text_dim)
    hr
        border: none
        border-top: var(--theme-border) 0.1rem solid
        margin: 2rem auto
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
    .reset-btn
        width: fit-content
        padding: 0.5rem 2rem
        margin-left: auto
        border-radius: 0.5rem
        background-color: #920
        font-weight: bold
        cursor: pointer
        opacity: 0.9
        transition: .2s
        &:hover
            opacity: 1
</style>
