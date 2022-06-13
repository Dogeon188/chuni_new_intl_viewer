<script lang="ts">
    export let label: string
    export let min: number
    export let max: number
    export let step: number
    export let low: number
    export let high: number

    let dist = max - min
    $: lowPer = (low - min) / dist * 100
    $: highPer = (high - min) / dist * 100
</script>

<div class="wrapper">
    <span>{label}</span>
    <div class="indicators">
        <div class="low" style="left: calc((100% - 3rem) * {lowPer} / 100)">
            {low.toFixed(1)}
        </div>
        <div class="high" style="left: calc((100% - 3rem) * {highPer} / 100)">
            {high.toFixed(1)}
        </div>
    </div>
    <div class="slider">
        <div
            class="slider-bg"
            style="
            background: linear-gradient(
                to right,
                var(--theme-border) 0%,
                var(--theme-border) {lowPer - 1}%,
                var(--theme-bg_control) {lowPer - 1}%,
                var(--theme-bg_control) {highPer + 1}%,
                var(--theme-border) {highPer + 1}%,
                var(--theme-border) 100%
            )" />
        <input
            class="low"
            type="range"
            {min}
            {max}
            {step}
            bind:value={low}
            on:input={() => {
                if (low > high) high = low
            }} />
        <input
            class="high"
            type="range"
            {min}
            {max}
            {step}
            bind:value={high}
            on:input={() => {
                if (high < low) low = high
            }} />
    </div>
</div>

<style lang="sass">
    .wrapper
        display: flex
        flex-direction: column
        padding: .5rem
        gap: .5rem
    .indicators
        height: .8rem
        position: relative
        & div
            background-color: var(--theme-bg_sub)
            height: 1.6rem
            width: 1.6rem
            border-radius: 50%
            display: flex
            justify-content: center
            align-items: center
            position: absolute
            border: var(--theme-border) .2rem solid
            &.low
                border-bottom-right-radius: 0
                transform: translateX(-.4rem)
            &.high
                border-bottom-left-radius: 0
                transform: translateX(1.6rem)
    .slider
        display: flex
        flex-direction: column
        justify-content: center
        width: 100%
        height: 3.5rem
        position: relative
    .slider-bg
        height: .4rem
        width: calc(100% - 2.6rem)
        margin-left: 1.4rem
        background-color: var(--theme-border)
        position: absolute
        border-radius: .2rem
    input[type=range]
        -webkit-appearance: none 
        appearance: none
        height: 0
        width: calc(100% - 1.5rem)
        position: absolute
        border-radius: .2rem
        pointer-events: none
        &.low
            &::-webkit-slider-thumb
                border-radius: 50% 0 0 50%
            &::-moz-range-thumb
                border-radius: 50% 0 0 50%
        &.high
            margin-left: 1.6rem
        @mixin slider-thumb
            z-index: 1
            -webkit-appearance: none
            pointer-events: all
            width: 1.5rem
            height: 2rem
            background-color: var(--theme-text_dim)
            border-radius: 0 50% 50% 0
            cursor: pointer
            transition: .2s
        &::-webkit-slider-thumb
            @include slider-thumb
        &::-moz-range-thumb
            @include slider-thumb
        &::-webkit-slider-thumb:hover
            background-color: var(--theme-text)
        &::-webkit-slider-thumb:active
            box-shadow: 0 0 .5rem var(--theme-text_dim)
            -webkit-box-shadow: 0 0 .5rem var(--theme-text_dim)
</style>
