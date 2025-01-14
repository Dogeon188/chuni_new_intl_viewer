<script lang="ts">
    import { fade } from "svelte/transition"
    import {
        sortBy,
        theme,
        filterConstMin,
        filterConstMax,
        usedSongData,
        showPlayCount,
        configs,
        acceptedSongData,
        showOp,
    } from "@/config"
    import { showConfig } from "@/stores"
    import { themeNames } from "@/themes"
    import Select from "@/components/Select.svelte"
    import ToggleSwitch from "@/components/ToggleSwitch.svelte"
    import DualSlider from "@/components/DualSlider.svelte"
    import ConfigDiffFilter from "@/components/ConfigDiffFilter.svelte"
    import ConfigPlayCount from "@/components/ConfigPlayCount.svelte"
    import ConfigGenreFilter from "./ConfigGenreFilter.svelte"
</script>

<div class="modal-wrapper" transition:fade={{ duration: 100 }}>
    <div class="modal-bg" on:click={showConfig.toggle} />
    <div class="modal">
        <div class="close-btn" on:click={showConfig.toggle}>✕</div>
        <h3>Options</h3>
        <div class="config-content">
            <h4>Sort & Filter</h4>
            <div>
                <Select label="Sort By" bind:value={$sortBy}>
                    <option value="rating">Rating</option>
                    <option value="score">Score</option>
                    <option value="op">Over Power</option>
                    <option value="opp">Over Power (%)</option>
                    <option value="const">Chart Constant</option>
                    <option value="title">Title</option>
                    <option value="aj">AJ&#xFF0F;FC</option>
                    <option value="play">Play Count</option>
                </Select>
                <DualSlider
                    label="Filter By Constant"
                    max={15.4}
                    min={1}
                    bind:low={$filterConstMin}
                    bind:high={$filterConstMax}
                    step={0.1} />
                <ConfigDiffFilter />
                <ConfigGenreFilter />
            </div>
            <hr />
            <h4>General</h4>
            <div>
                <Select label="Theme" bind:value={$theme}>
                    {#each themeNames as t}
                        <option value={t}>{t}</option>
                    {/each}
                </Select>
                {#if acceptedSongData.indexOf("jp") > -1}
                    <Select label="Song Data to Use" bind:value={$usedSongData}>
                        <option value="intl">International Ver.</option>
                        <option value="jp">Japanese ver. (NEW+)</option>
                    </Select>
                {/if}
                <ToggleSwitch label="Show Over Power" bind:checked={$showOp} />
                <ToggleSwitch label="Show Play Count" bind:checked={$showPlayCount} />
                {#if $showPlayCount}
                    <ConfigPlayCount />
                {/if}
            </div>
        </div>
        <hr />
        <div
            class="btn reset-btn"
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
        width: 100%
        height: 100%
        display: flex
        align-items: center
    .modal-bg
        position: fixed
        background: #0006
        top: 0
        left: 0
        width: 100%
        height: 100%
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
    .close-btn
        position: absolute
        top: .5rem
        right: .5rem
        width: 2rem
        height: 2rem
        background-color: var(--theme-border)
        border-radius: 40%
        display: inline-flex
        justify-content: center
        align-items: center
        opacity: 0.6
        transition-duration: 0.2s
        cursor: pointer
        &:hover
            opacity: 0.9
    h3
        margin: 0
    h4
        margin: .5rem 0
        color: var(--theme-text_dim)
    hr
        border: none
        border-top: var(--theme-border) .1rem solid
        margin: 2rem auto
    .config-content
        padding: 5px
    .btn
        width: fit-content
        padding: .5rem 1.5rem
        border-radius: .8rem
        font-weight: bold
        cursor: pointer
        user-select: none
        opacity: .9
        transition: .2s
        &:hover
            opacity: 1
    .reset-btn
        margin-left: auto
        background-color: #920
</style>
