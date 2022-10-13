<script lang="ts">
    import { fetchPlayCount } from "@/utils/fetch"
    import { showPlayCount } from "@/config"
    import { shownTab } from "@/stores"

    export let song: ChuniRecord
    export let isOfficialRecent = false
    
    $: isRecent = $shownTab == "recent"
</script>

<tr
    class:best30={song.rank <= (isRecent ? 10 : 30) && (!isRecent || isOfficialRecent)}
    class:best40={song.rank <= (isRecent ? 10 : 40)}>
    <td>{song.rank}</td>
    <td data-diff={song.difficulty}>{song.title}</td>
    <td>{song.const == -1 ? "-" : song.const?.toFixed(1) ?? "??.?"}</td>
    <td>{song.score}</td>
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
        tr td:nth-child(6)
            font-weight: bold
            &[data-clear="FC"]
                color: var(--theme-clear_fc)
            &[data-clear="AJ"]
                color: var(--theme-clear_aj)
            &[data-clear="-"]
                color: var(--theme-text_dim)
    .pc-hidden
        cursor: pointer
        span
            border-radius: .2rem
            background-color: var(--theme-bg_sub)
            color: var(--theme-bg_sub)
</style>
