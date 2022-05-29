<script lang="ts">
    export let title: string
    export let content: string
</script>

<span class="overview-title">{title}</span>
<span class="overview-content">{content}</span>

<style lang="sass">
    .overview-title
        color: #c9e
        font-size: small
        grid-column: 1
        justify-self: end
    .overview-content
        justify-self: start
        grid-column: 2
</style>