<script lang="ts">
    export let config: boolean[]
</script>

<div class="wrapper">
    <span>
        Filter By Difficulty
        {#if config.every((i) => !i)}
            <span style="color:var(--theme-song_exp)">*must select at least one!</span>
        {/if}
    </span>
    <div class="btns">
        {#each ["BAS", "ADV", "EXP", "MAS", "ULT"] as diff, i}
            <label>
                <input
                    type="checkbox"
                    value={diff.toLowerCase()}
                    bind:checked={config[i]} />
                <div class="btn" data-diff={diff}>{diff}</div>
            </label>
        {/each}
    </div>
    <span style="color:var(--theme-text_dim)">
        *Filtering difficulties might cause the "Best 30" data to be inaccurate.
    </span>
</div>

<style lang="sass">
    .wrapper   
        display: flex
        flex-direction: column
        padding: .5rem
        gap: 1rem
    .btns
        display: flex
        flex-direction: row
        gap: .5rem
        user-select: none
    label
        flex-grow: 1
        display: flex
    input
        width: 0
        height: 0
        opacity: 0
        &:checked + .btn
            background-color: var(--theme-bg_control)
    .btn
        width: 100%
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
