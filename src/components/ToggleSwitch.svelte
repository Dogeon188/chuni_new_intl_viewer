<script lang="ts">
    export let checked = false
    export let label: string
    export let needReload = false
    let changed = false
</script>

<label>
    <span>
        {label}
        {#if needReload && changed}
            <span style="color:var(--theme-text_dim)">*require reload</span>
        {/if}
    </span>
    <input type="checkbox" bind:checked on:change={() => (changed = true)}/>
    <div class="wrapper">
        <span class="slider" />
    </div>
</label>

<style lang="sass">
    label
        display: flex
        flex-direction: column
        padding: .5rem
        gap: .2rem
    .wrapper
        position: relative
        width: 4.5rem
        height: 2rem
        display: inline-block
    input
        width: 0
        height: 0
        opacity: 0
        &:checked + .wrapper .slider
            background-color: var(--theme-bg_control)
            &:before
                transform: translateX(2.5rem)
            &:after
                content: "ON"
                left: .6rem
                right: initial
    .slider
        position: absolute
        cursor: pointer
        top: 0
        left: 0
        right: 0
        bottom: 0
        background-color: var(--theme-bg_sub)
        transition: .2s
        border-radius: .8rem
        &:after // text
            color: var(--theme-text_control)
            position: absolute
            content: "OFF"
            display: flex
            align-items: center
            height: 100%
            right: .6rem
            font-weight: bold
        &:before // slider
            position: absolute
            content: ""
            height: 1.6rem
            width: 1.6rem
            left: .2rem
            bottom: .2rem
            background-color: var(--theme-text_control)
            transition: .2s
            border-radius: 40%
</style>
