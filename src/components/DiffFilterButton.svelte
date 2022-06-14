<script lang="ts">
    export let diff: string
    export let checked: boolean
</script>

<label>
    <input type="checkbox" value={diff.toLowerCase()} bind:checked />
    <div class="btn" data-diff={diff}>{diff}</div>
</label>

<style lang="sass">
    label
        flex-grow: 1
    input
        width: 0
        height: 0
        opacity: 0
        &:checked + .btn
            background-color: var(--theme-bg_control)
    .btn
        padding: .5rem
        border-radius: .2rem
        background-color: var(--theme-bg_sub)
        text-align: center
        font-weight: bold
        cursor: pointer
        transition: .2s
        color: var(--theme-text_control)
        @each $diff in ("ULT", "MAS", "EXP", "ADV", "BAS")
            &[data-diff="#{$diff}"]::before
                content: "● "
                color: var(--theme-song_#{to-lower-case($diff)})
</style>
