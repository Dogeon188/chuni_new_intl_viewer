<script lang="ts">
    import { showConfig, sortBy } from "../stores"
    import { saveResultAsPicture } from "../utils/share"
</script>

<div class="btn-container">
    <div
        class="btn"
        class:disabled={$sortBy != "Rating"}
        on:click={() => {if ($sortBy == "Rating") saveResultAsPicture()}}>
        <svg width="18" height="18">
            <path d="M7 2H11V8H15L9 14 3 8H7V2ZM3 14H15V16H3V14Z" fill="#fef" />
        </svg>
    </div>
    <div class="btn" on:click={showConfig.toggle}>
        <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 4H16V6H2V4ZM2 8H16V10H2V8ZM2 12H16V14H2V12Z" fill="#fef" />
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
        width: 2rem
        height: 2rem
        background: #536
        border-radius: 50%
        box-shadow: 0.2rem 0.2rem 5px #000
        display: inline-flex
        justify-content: center
        align-items: center
        opacity: 0.6
        cursor: pointer
        transition-duration: 0.2s
        &:hover
            opacity: 0.9
        &.disabled
            opacity: 0.2
            cursor: unset
</style>