<script setup>
import license from '../../LICENSE?raw'
</script>

<template>
    <article class="licence-content">
        <pre>{{ license }}</pre>
    </article>
</template>

<style scoped>
.licence-content {
    max-width: 48rem;
    margin: 0 auto;
    color: var(--p-surface-800);
}

.licence-content pre {
    margin: 0;
    white-space: pre-wrap;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.875rem;
    line-height: 1.6;
}
</style>
