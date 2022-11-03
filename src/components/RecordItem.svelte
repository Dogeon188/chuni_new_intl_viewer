<script lang="ts">
    import { fetchPlayCount } from "@/utils/fetch"
    import { showOp, showPlayCount } from "@/config"
    import { shownTab } from "@/stores"

    export let song: ChuniRecord
    export let isOfficialRecent = false

    $: isRecent = $shownTab == "recent"
</script>

<tr
    class:best30={song.order <= (isRecent ? 10 : 30) && (!isRecent || isOfficialRecent)}
    class:best40={song.order <= (isRecent ? 10 : 40)}
    class:ajc={song.score == 1010000}>
    <td>{song.order}</td>
    <td data-diff={song.difficulty}>{song.title}</td>
    <td>{song.const == -1 ? "-" : song.const?.toFixed(1) ?? "??.?"}</td>
    {#if $showOp}
        <td>
            {song.op.toFixed(2)}<span class="opmx">&#xFF0F;{song.opmax.toFixed(1)}</span>
        </td>
        <td>
            {((100 * song.op) / song.opmax).toPrecision(5)}<span class="opmx">%</span>
        </td>
    {:else}
        <td data-rank={song.rank}>{song.rank}</td>
        <td>{song.score}</td>
    {/if}
    <td
        >{song.const == -1
            ? "-"
            : song.rating == null
            ? "??.??"
            : song.rating.toFixed(2)}</td>
    <td data-clear={song.clear}>{song.clear}</td>
    {#if $showPlayCount && !isRecent}
        {#if song.playCount == undefined}
            <td
                class="pc-hidden"
                on:click={async () => {
                    song.playCount = await fetchPlayCount(song.idx, song.difficulty)
                }}>
                <span>...</span>
            </td>
        {:else}
            <td>{song.playCount || "?"}</td>
        {/if}
    {/if}
</tr>

<style lang="sass">
    td
        padding: 0.5rem
        border-top: var(--theme-border) 1.5px solid
    tbody
        tr.best30 td:first-child
            color: var(--theme-rank_b30)
        tr.best40 td:first-child
            font-weight: bold
        tr:not(.best40) td:first-child
            color: var(--theme-text_dim)
        tr td:nth-child(2)
            font-weight: bold
            text-align: left
            max-width: 300px
            @each $diff in ("WE", "ULT", "MAS", "EXP", "ADV", "BAS")
                &[data-diff="#{$diff}"]
                    color: var(--theme-song_#{to-lower-case($diff)})
        tr td:nth-child(4)
            white-space: nowrap
            &[data-rank="MAX"]
                color: var(--theme-clear_aj)
                text-shadow: 0 0 10px var(--theme-clear_aj)
            @each $rank, $p in (("SSS+", 0), ("SSS", 2), ("SS+", 4), ("SS", 6), ("S+", 2), ("S", 4))
                &[data-rank="#{$rank}"]
                    color: adjust-color(#fc1, $whiteness: ($p * 10%))
            @each $rank, $p in (("AAA", 0), ("AA", 1), ("A", 2), ("BBB", 3), ("BB", 4), ("B", 5))
                &[data-rank="#{$rank}"]
                    color: adjust-color(#cef, $whiteness: ($p * -15%))
            @each $rank, $p in ("MAX", "SSS+", "SSS", "SS+", "SS")
                &[data-rank="#{$rank}"]
                    font-weight: bold
            &[data-rank="C"]
                color: #888
            &[data-rank="D"]
                color: #666
        tr td[data-clear]
            font-weight: bold
            &[data-clear="FC"]
                color: var(--theme-clear_fc)
            &[data-clear="AJ"]
                color: var(--theme-clear_aj)
            &[data-clear="-"]
                color: var(--theme-text_dim)
        tr.ajc
            td:nth-child(4), td:nth-child(5), td[data-clear]
                color: var(--theme-clear_aj)
                text-shadow: 0 0 10px var(--theme-clear_aj)
    .opmx
        color: var(--theme-text_dim)
        font-size: .8rem
    .pc-hidden
        cursor: pointer
        span
            border-radius: .2rem
            background-color: var(--theme-bg_sub)
            color: var(--theme-bg_sub)
</style>
