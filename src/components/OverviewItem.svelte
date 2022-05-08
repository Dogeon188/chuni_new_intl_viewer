<script lang="ts">
    export let title: string
    export let content: string
</script>

<style lang="sass">
    div
        padding: 5px
    .overview-title
        color: #c9e
        font-size: small
    .overview-content
        margin-inline-start: 0
</style>

<div>
    <span class="overview-title">{title}</span>
    <span class="overview-content">{content}<span>
</div>
