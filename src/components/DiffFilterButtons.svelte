<script lang="ts">
    export let config: boolean[]
    let changed = false
</script>

<div class="wrapper">
    <span>
        Filter By Difficulty
        {#if changed}
            <span style="color:var(--theme-text_dim)">*require reload</span>
        {/if}
    </span>
    <div class="btns">
        {#each ["BAS", "ADV", "EXP", "MAS", "ULT"] as diff, i}
            <label>
                <input
                    type="checkbox"
                    value={diff.toLowerCase()}
                    bind:checked={config[i]}
                    on:change={() => (changed = true)} />
                <div class="btn" data-diff={diff}>{diff}</div>
            </label>
        {/each}
    </div>
</div>

<style lang="sass">
    .wrapper   
        display: flex
        flex-direction: column
        padding: .5rem
        gap: .5rem
    .btns
        display: flex
        flex-direction: row
        gap: .5rem
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
