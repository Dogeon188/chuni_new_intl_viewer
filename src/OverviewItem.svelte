<script lang="ts">
    export let title: string
    export let content: string
</script>

<style lang="sass">
    dt
        font-size: 0.5em
        color: #c9e
    dd
        margin-inline-start: 1em
</style>

<div>
    <dt>{title}</dt>
    <dd>{content}</dd>
</div>