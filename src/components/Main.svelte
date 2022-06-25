<script lang="ts">
    import { onMount } from "svelte"
    import { themes } from "@/themes"
    import { setRootColors } from "@/utils/utils"
    import Result from "@/components/Result.svelte"
    import Buttons from "@/components/Buttons.svelte"
    import ConfigModal from "@/components/ConfigModal.svelte"
    import Overview from "@/components/Overview.svelte"
    import { recordList } from "@/stores"
    import { theme } from "@/config"
    import LoadingModal from "@/components/LoadingModal.svelte"
    import Footer from "@/components/Footer.svelte"

    onMount(() => {
        setRootColors(themes[$theme])
    })
</script>

<body>
    {#await recordList.init()}
        <LoadingModal />
    {:then}
        <div style="min-height:100vh;display:flex;flex-direction:column;">
            <main>
                {#if $recordList.length == 0}
                    <h3>
                        Fetched nothing >:( <br />
                    </h3>
                    <p>
                        I can't get any record with your current settings...<br />
                    </p>
                    <p>
                        You should
                        <em>change your difficulty filter</em>
                        to something more interesting.
                    </p>
                {:else}
                    <Overview />
                    <Result />
                {/if}
            </main>
            <Buttons />
            <Footer />
        </div>
    {/await}
    <ConfigModal />
</body>

<style lang="sass">
    :global(::-webkit-scrollbar)
        width: .6rem
    :global(::-webkit-scrollbar-thumb)
        border-radius: .1rem
        width: .2rem
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
        background-color: var(--theme-border)
        border-width: 1rem .2rem
        border-style: solid
        border-color: transparent
        background-clip: content-box
    :global(em)
        font-style: normal
        font-weight: bold
        color: var(--theme-link)
    :global(a)
        color: var(--theme-link)
        text-decoration: none
        &:hover
            text-decoration: underline dotted
    body
        background-color: var(--theme-bg_main)
        color: var(--theme-text)
        margin: 0
        font-size: 14px
        min-height: 100%
        min-width: fit-content
    main
        width: fit-content
        margin: 1rem auto
</style>
