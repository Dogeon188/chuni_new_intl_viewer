<script lang="ts">
    import { getRecord } from "../utils/fetch"
    import Result from "./Result.svelte"
    import Buttons from "./Buttons.svelte"
    import ConfigModal from "./ConfigModal.svelte"
    import Overview from "./Overview.svelte"
    import { msgText } from "../stores"
</script>

<body>
    {#await getRecord()}
        <h3>Chunithm International Score Viewer</h3>
        <div>
            <p>Loading...</p>
            <p>{$msgText}</p>
        </div>
    {:then recordList} 
        <main>
            <Overview ratingList={ recordList.map((s) => s.rating) } />
            <Result {recordList} />
        </main>
        <Buttons />
    {/await}
    <ConfigModal />
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

<style lang="sass">
    body
        padding-top: 1rem
        background-color: #103
        color: #eec
        margin: 0
        font-size: 14px
        min-height: 100%
        min-width: fit-content
        a
            color: #3cc
            text-decoration: none
    main
        width: fit-content
        margin: auto
    footer
        padding: 10px
</style>