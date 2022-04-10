<script lang="ts">
    export let title: string
    export let content: string
</script>

<style lang="sass">
    dt
        color: #c9e
    dd
        margin-inline-start: 1rem
</style>

<div>
    <dt>{title}</dt>
    <dd>{content}</dd>
</div>