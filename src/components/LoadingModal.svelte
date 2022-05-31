<script lang="ts">
    import { msgText } from "../stores"
</script>

<div class="modal-wrapper">
    <div class="modal-bg" />
    <div class="modal">
        <h3>Chunithm International Score Viewer</h3>
        <div class="loader" />
        <p>{$msgText}</p>
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
        width: 50%
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
        border-top: .5rem solid var(--theme-label)
        border-radius: 50%
        width: 4rem
        height: 4rem
        animation: spin 1s cubic-bezier(.5, .2, .5, .8) infinite
    @keyframes spin
        0%
            transform: rotate(0deg)
        100%
            transform: rotate(360deg)
</style>
