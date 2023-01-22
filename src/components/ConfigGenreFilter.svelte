<script lang="ts">
    import { filterGenre } from "@/config"
    import { genres } from "@/utils/fetch"
    let allGenre = genres.every((genre) => $filterGenre[genre[1]])
</script>

<div class="wrapper">
    <span> Filter By Genre </span>
    <div class="btns">
        {#each genres as [genre, genreId]}
            <label>
                <input
                    type="checkbox"
                    value={genre}
                    bind:checked={$filterGenre[genreId]}
                    on:change={() => {
                        allGenre = genres.every((v) => $filterGenre[v[1]])
                    }} />
                <div class="btn">{genre}</div>
            </label>
        {/each}
        <label>
            <input
                type="checkbox"
                value="ALL"
                bind:checked={allGenre}
                on:change={(e) => {
                    for (let genre of genres) {
                        $filterGenre[genre[1]] = e.target?.checked
                    }
                }} />
            <div class="btn btn-all">ALL</div>
        </label>
    </div>
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
        flex-wrap: wrap
    label
        flex-grow: 1
        display: flex
    input
        width: 0
        height: 0
        opacity: 0
        &:checked + .btn
            background-color: var(--theme-bg_control)
        &:checked + .btn-all
            background-color: #b61
    .btn
        width: 100%
        padding: .5rem
        border-radius: .5rem
        background-color: var(--theme-bg_sub)
        text-align: center
        font-weight: bold
        cursor: pointer
        transition: .2s
        color: var(--theme-text_control)
</style>
