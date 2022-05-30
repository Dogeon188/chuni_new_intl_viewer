<script lang="ts">
    export let checked = false
</script>

<label>
    <input type="checkbox" bind:checked>
    <span/>
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
            background-color: #739
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
        background-color: #345
        transition: .2s
        border-radius: 2rem
        &:after // text
            position: absolute
            content: "OFF"
            display: flex
            align-items: center
            height: 100%
            right: .6rem
        &:before // slider
            position: absolute
            content: ""
            height: 1.6rem
            width: 1.6rem
            left: .2rem
            bottom: .2rem
            background-color: #ccd
            transition: .2s
            border-radius: 50%
</style>