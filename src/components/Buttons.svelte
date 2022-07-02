<script lang="ts">
    import { showConfig } from "@/stores"
    import { sortBy, usedSongData } from "@/config"
    import { saveResultAsPicture } from "@/utils/share"
</script>

<div class="btn-container">
    <div
        class="btn"
        class:disabled={$sortBy != "Rating"}
        on:click={$sortBy == "Rating" ? saveResultAsPicture : undefined}>
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

<style lang="sass">
    .btn-container
        position: fixed
        bottom: 1rem
        right: 1rem
        display: flex
        flex-direction: column
        gap: .75rem
    .btn
        width: 2.5rem
        height: 2.5rem
        background: var(--theme-border)
        border-radius: 50%
        box-shadow: 0.2rem 0.2rem 5px black
        display: inline-flex
        justify-content: center
        align-items: center
        opacity: 0.6
        cursor: pointer
        user-select: none
        transition-duration: 0.2s
        &:hover
            opacity: 0.9
        &.disabled
            opacity: 0.2
            cursor: unset
</style>
