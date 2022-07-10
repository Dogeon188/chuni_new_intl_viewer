<script lang="ts">
    import { shownTab, showConfig } from "@/stores"
    import { sortBy, usedSongData } from "@/config"
    import { saveResultAsPicture } from "@/utils/share"
</script>

<header>
    {#each [["best", "RECORDS"], ["recent", "RECENT"]] as [t, d]}
        <h3 class:selected={$shownTab == t} on:click={() => ($shownTab = t)}>
            {d}
        </h3>
    {/each}
    <div style="flex-grow:1"/>
    <div class="btn-container">
        <div
            class="btn"
            on:click={saveResultAsPicture}>
            <svg width="18" height="18">
                <path d="M7 2H11V8H15L9 14 3 8H7V2ZM3 14H15V16H3V14Z" fill="white" />
            </svg>
        </div>
        <div
            class="btn"
            style="font-weight:bold"
            on:click={() => {
                $usedSongData = $usedSongData == "jp" ? "intl" : "jp"
            }}>
            {$usedSongData == "jp" ? "JP" : "IN"}
        </div>
        <div class="btn" on:click={showConfig.toggle}>
            <svg width="18" height="18">
                <path d="M2 4H16V6H2V4ZM2 8H16V10H2V8ZM2 12H16V14H2V12Z" fill="white" />
            </svg>
        </div>
    </div>
</header>

<style lang="sass">
    header
        display: flex
        gap: .5rem
        padding: 0 1rem
    h3
        margin: 0
        padding: 1rem 5%
        cursor: pointer
        color: var(--theme-text_dim)
        &.selected
            color: var(--theme-text)
    .btn-container
        display: flex
        flex-direction: row
        justify-content: space-between
        align-items: center
        gap: 1rem
    .btn
        width: 2.5rem
        height: 2.5rem
        background: var(--theme-border)
        border-radius: 40%
        display: inline-flex
        justify-content: center
        align-items: center
        opacity: 0.6
        cursor: pointer
        user-select: none
        transition-duration: 0.2s
        &:hover
            opacity: 0.9
</style>
