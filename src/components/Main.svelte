<script lang="ts">
    import { onMount } from "svelte"
    import { themes } from "../themes"
    import { getRecord } from "../utils/fetch"
    import { setRootColors } from "../utils/utils"
    import Result from "./Result.svelte"
    import Buttons from "./Buttons.svelte"
    import ConfigModal from "./ConfigModal.svelte"
    import Overview from "./Overview.svelte"
    import { theme } from "../stores"
    import LoadingModal from "./LoadingModal.svelte"
    import Footer from "./Footer.svelte"

    onMount(() => {
        setRootColors(themes[$theme])
    })
</script>

<body>
    {#await getRecord()}
        <LoadingModal />
    {:then recordList}
        <main>
            <Overview ratingList={recordList.map((s) => s.rating)} />
            <Result {recordList} />
        </main>
        <Buttons />
        <Footer />
    {/await}
    <ConfigModal />
</body>

<style lang="sass">
    body
        padding-top: 1rem
        background-color: var(--theme-bg_main)
        color: var(--theme-text)
        margin: 0
        font-size: 14px
        min-height: 100%
        min-width: fit-content
    main
        width: fit-content
        margin: auto
</style>
