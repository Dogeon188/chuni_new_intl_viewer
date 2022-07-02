<script lang="ts">
    import {
        sortBy,
        filterB40,
        theme,
        filterConstMin,
        filterConstMax,
        usedSongData,
        showPlayCount,
        configs,
        filterDiff,
    } from "@/config"
    import { showConfig, recordList, msgText, fetchingPlayCount } from "@/stores"
    import { themeNames } from "@/themes"
    import { fetchPlayCount } from "@/utils/fetch"
    import Select from "@/components/Select.svelte"
    import ToggleSwitch from "@/components/ToggleSwitch.svelte"
    import DualSlider from "@/components/DualSlider.svelte"
    import DiffFilterButtons from "./DiffFilterButtons.svelte"

    async function fetchMultiPlayCount(from: number, to: number) {
        if ($fetchingPlayCount || isNaN(from) || isNaN(to) || to < from) return
        $fetchingPlayCount = true
        const l = $recordList.slice(from - 1, to).length
        for (const [i, song] of $recordList.slice(from - 1, to).entries()) {
            msgText.set(`Fetching play count... (${i}/${l})`)
            if (song.playCount != undefined) continue
            song.playCount = await fetchPlayCount(song.idx, song.difficulty)
        }
        recordList.set($recordList)
        $fetchingPlayCount = false
    }

    let from: number, to: number
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
                <Select label="Song Data to Use" bind:value={$usedSongData}>
                    <option value="intl">International Ver.</option>
                    <option value="jp">Japanese ver. (NEW+)</option>
                </Select>
                <ToggleSwitch
                    label="Show Play Count"
                    bind:checked={$showPlayCount}
                    needReload />
                {#if $showPlayCount}
                    <div style="padding:.5rem;display:flex;gap:.5rem">
                        <div
                            class="btn pc-multi-btn"
                            class:disabled={$fetchingPlayCount ||
                                isNaN(from) ||
                                isNaN(to) ||
                                to < from}
                            on:click={() => fetchMultiPlayCount(from, to)}>
                            Fetch
                        </div>
                        <span>
                            from
                            <input type="number" min="1" placeholder="1" bind:value={from} />
                            to
                            <input type="number" min="1" placeholder="40" bind:value={to} />
                        </span>
                    </div>
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
        &.hidden
            display: none
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
        border-radius: 50%
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
        padding: .5rem 2rem
        border-radius: .5rem
        font-weight: bold
        cursor: pointer
        user-select: none
        opacity: .9
        transition: .2s
        &:hover
            opacity: 1
    input[type=number]
        background-color: var(--theme-bg_sub)
        color: var(--theme-text)
        border: none
        border-radius: .2rem
        width: 5rem
        padding: .5rem
        -moz-appearance: textfield
        &::-webkit-inner-spin-button
            -webkit-appearance: none
            margin: 0
    .pc-multi-btn
        background-color: var(--theme-bg_control)
        &.disabled
            background-color: var(--theme-border)
            cursor: no-drop
    .reset-btn
        margin-left: auto
        background-color: #920
</style>
