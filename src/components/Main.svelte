<script lang="ts">
    import { getRecord } from "../utils/fetch"
    import Result from "./Result.svelte"
    import { msgText } from "../stores"

    let loaded = false
    let recordList = [] as ChuniRecord[]
    ;(async () => {
        recordList = await getRecord()
        loaded = true
    })()
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
</style>

<body>
    <div>
        <h3>Chunithm International Score Viewer</h3>
        <a
            href="https://github.com/Dogeon188/chuni_new_intl_viewer"
            target="_blank"
            rel="noopener noreferrer">Dogeon188/chuni_new_intl_viewer@GitHub</a>
    </div>
    {#if !loaded}
        <div>
            <p>Loading...</p>
            <p>{$msgText}</p>
        </div>
    {:else}
        <Result {recordList} />
    {/if}
</body>
