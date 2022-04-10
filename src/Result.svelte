<script lang="ts">
    export let recordList: ChuniRecord[]

    import Overview from "./Overview.svelte"
    import { saveResultAsPicture } from "./utils/img"
    import { calcB30, calcMaxRating } from "./utils/rating"
    import { isMobile } from "./utils/utils"
    
    let filterb40 = isMobile()
    $: filteredList = filterb40 ? recordList.slice(0, 40) : recordList
    
    const ratingList = recordList.map(s => s.rating)
    const totalMasterScore = recordList
        .filter(r => r.difficulty === "MAS")
        .map(r => r.score)
        .reduce((a, b) => a + b)
</script>

<style lang="sass">
    button
        margin: 0.5em,
        padding: 0.3em
        font-family: inherit,
        font-weight: bold,
        background-color: #324,
        border: #536 3px solid,
        color: #eec,
        border-radius: 0.3em,
        cursor: pointer
        &.filter
            border-color: #48c
            background-color: #159
            width: 9em
        &.dl i
            background-image: url(https://raw.githubusercontent.com/Dogeon188/chuni_new_intl_viewer/main/assets/dl.png)
            display: inline-block
            width: 1em
            height: 1em
            background-position: 0px 0px
            background-size: cover
    table
        border-spacing: 0
        padding-bottom: 1em
        width: 100%
    td, th
        padding: 0.5em
    tbody
        & tr:nth-child(-n+30) td:first-child
            color: #fc4
        & tr:nth-child(-n+40) td:first-child
            font-weight: bold
        & tr:nth-child(odd)
            background-color: #324
        & tr td:nth-child(2)
            font-weight: bold
            &.diff-ult
                color: #3cf
            &.diff-mas
                color: #e9f
            &.diff-exp
                color: #e46
            &.diff-adv
                color: #e73
            &.diff-bas
                color: #1c3
            
</style>

<div class="buttons">
    <button class="filter" on:click={() => {filterb40 = !filterb40}}>
        {filterb40 ? "Show All" : "Show Best 40"}
    </button>
    <button class="dl" on:click={
        (ce) => saveResultAsPicture(ce, "b30")
        }><i/>Best 30</button>
    <button class="dl" on:click={
        (ce) => saveResultAsPicture(ce, "b40")
        }><i/>Best 40</button>
</div>

<main id="chuni-viewer-main">
<Overview
    b30={calcB30(ratingList)}
    maxAchievable={calcMaxRating(ratingList)}
    {totalMasterScore} />

<table id="chuni-result-table">
    <thead>
        <tr>
            <th>#</th>
            <th>Song Name</th>
            <th>Constant</th>
            <th>Score</th>
            <th>Rating</th>
            <th>FC/AJ</th>
        </tr>
    </thead>
    <tbody>
        {#each filteredList as song, i}
            <tr>
                <td>{i + 1}</td>
                <td class="diff-{song.difficulty.toLowerCase()}">{song.title}</td>
                <td>{song.const?.toFixed(1) ?? "??.?"}</td>
                <td>{song.score}</td>
                <td>{song.rating?.toFixed(2) ?? "??.??"}</td>
                <td>
                    {#if song.clear !== null}
                        <img src="https://chunithm-net-eng.com/mobile/images/icon_{song.clear}.png" alt={song.clear}/>
                    {/if}
                </td>
            </tr>
        {/each}
    </tbody>
</table>
</main>