<script lang="ts">
    import { getRecord } from "../utils/fetch"
    import Result from "./Result.svelte"
    import { msgText } from "../stores"
</script>

<style lang="sass">
    body
        padding-top: 1rem
        background-color: #113
        color: #eec
        margin: 0
        font-size: 14px
        min-height: 100%
        min-width: fit-content
        a
            color: #3cc
            text-decoration: none
    footer
        padding: 10px
</style>

<body>
    <h3>Chunithm International Score Viewer</h3>
    {#await getRecord()}
        <div>
            <p>Loading...</p>
            <p>{$msgText}</p>
        </div>
    {:then recordList} 
        <Result {recordList} />
    {/await}
    <footer>
        <span>
            <a
                href="https://github.com/Dogeon188/chuni_new_intl_viewer"
                target="_blank"
                rel="noopener noreferrer"
                >Source</a>
        </span><br/>
        <span>
            Original & most works by <a
                href="https://github.com/kyroslee/chuni_intl_viewer"
                target="_blank"
                rel="noopener noreferrer"
                >kyroslee</a>
        </span><br/>
        <span>
            Mostly inspired by <a
                href="https://github.com/caxerx/chuni_intl_viewer"
                target="_blank"
                rel="noopener noreferrer"
                >caxerx</a>
        </span>
    </footer>
</body>
