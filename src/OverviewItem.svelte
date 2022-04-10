<script lang="ts">
    export let title: string
    export let content: string
</script>

<style lang="sass">
    dt
        color: #c9e
        font-size: small
    dd
        // margin-inline-start: 1rem
        margin-inline-start: 0
</style>

<div>
    <dt>{title}</dt>
    <dd>{content}</dd>
</div>