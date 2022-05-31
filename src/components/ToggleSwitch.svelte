<script lang="ts">
    export let checked = false
</script>

<label>
    <input type="checkbox" bind:checked />
    <span />
</label>

<style lang="sass">
    label
        position: relative
        width: 4.5rem
        height: 2rem
        display: inline-block
    input
        width: 0
        height: 0
        opacity: 0
        &:checked + span
            background-color: var(--theme-switch_on)
            &:before
                transform: translateX(2.5rem)
            &:after
                content: "ON"
                left: .6rem
                right: initial
    span
        position: absolute
        cursor: pointer
        top: 0
        left: 0
        right: 0
        bottom: 0
        background-color: var(--theme-bg_sub)
        transition: .2s
        border-radius: 2rem
        &:after // text
            color: var(--theme-switch_fill)
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
            background-color: var(--theme-switch_fill)
            transition: .2s
            border-radius: 50%
</style>
