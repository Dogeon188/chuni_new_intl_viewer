<script lang="ts">
    import { errorFetching, msgText, usedSongData } from "@/stores"
</script>

<div class="modal-wrapper">
    <div class="modal-bg" />
    <div class="modal">
        <h3>
            Chunithm International Score Viewer <span
                style="color:var(--theme-text_dim);font-weight:normal;font-size:small"
                >@__APP_VERSION__</span>
        </h3>
        {#if $errorFetching}
            <div class="error">:(</div>
            <p>{@html $msgText}</p>
        {:else}
            <div class="loader" />
            <p>{$msgText}</p>
            <p style="color:var(--theme-text_dim)">
                Using song data: {$usedSongData == "intl"
                    ? "International"
                    : "Japanese (NEW+)"}
            </p>
        {/if}
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
        margin: auto
        padding: 2rem
        position: relative
        box-shadow: 2rem 2rem 10px #0008
        border-radius: 1rem
        text-align: center
    .loader
        margin: 2rem auto
        border: .5rem solid transparent
        border-top-color: var(--theme-label)
        border-radius: 50%
        width: 4rem
        height: 4rem
        animation: spin 1s cubic-bezier(.5, .2, .5, .8) infinite
    .error
        margin: 4rem auto
        height: 4rem
        font-size: 5rem
        color: var(--theme-label)
    @keyframes spin
        0%
            transform: rotate(0deg)
        100%
            transform: rotate(360deg)
</style>
