<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import Message from 'primevue/message'
import readme from '../../README.md?raw'

const alertMatch = readme.match(
    /^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:>.*\n?)*)/m
)

const severityByAlert = {
    NOTE: 'info',
    TIP: 'success',
    IMPORTANT: 'info',
    WARNING: 'warn',
    CAUTION: 'error',
}

const alert = computed(() => {
    if (!alertMatch) return null
    const [, type, body] = alertMatch
    const markdown = body
        .split('\n')
        .map((line) => line.replace(/^>\s?/, ''))
        .join('\n')
        .trim()
    return {
        severity: severityByAlert[type] ?? 'info',
        html: marked.parse(markdown),
    }
})

const html = computed(() => {
    const source = alertMatch
        ? readme.replace(alertMatch[0], '').replace(/\n{3,}/g, '\n\n')
        : readme
    return marked.parse(source)
})

const titleHtml = computed(() => {
    const match = html.value.match(/^<h1[\s\S]*?<\/h1>\s*/i)
    return match ? match[0] : ''
})

const bodyHtml = computed(() => {
    return titleHtml.value
        ? html.value.slice(titleHtml.value.length)
        : html.value
})
</script>

<template>
    <article class="about-content">
        <div v-if="titleHtml" v-html="titleHtml" />
        <Message
            v-if="alert"
            :severity="alert.severity"
            class="mb-6"
            :closable="false"
        >
            <div class="alert-body" v-html="alert.html" />
        </Message>
        <div v-html="bodyHtml" />
    </article>
</template>

<style scoped>
.about-content {
    max-width: 48rem;
    margin: 0 auto;
    line-height: 1.6;
    color: var(--p-surface-800);
}

.about-content :deep(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 1rem;
}

.about-content :deep(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 2rem 0 0.75rem;
}

.about-content :deep(h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 1.5rem 0 0.5rem;
}

.about-content :deep(p),
.about-content :deep(ul),
.about-content :deep(ol) {
    margin: 0 0 1rem;
}

.about-content :deep(.alert-body > :last-child) {
    margin-bottom: 0;
}

.about-content :deep(ul),
.about-content :deep(ol) {
    padding-left: 1.5rem;
}

.about-content :deep(ul) {
    list-style-type: disc;
}

.about-content :deep(ol) {
    list-style-type: decimal;
}

.about-content :deep(li) {
    display: list-item;
    margin: 0.25rem 0;
}

.about-content :deep(a) {
    color: var(--p-primary-600);
    text-decoration: underline;
}

.about-content :deep(strong) {
    font-weight: 700;
}

.about-content :deep(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.875em;
    background: var(--p-surface-100);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
}

.about-content :deep(pre) {
    background: var(--p-surface-100);
    border: 1px solid var(--p-surface-200);
    border-radius: 0.5rem;
    padding: 1rem;
    overflow-x: auto;
    margin: 0 0 1rem;
}

.about-content :deep(pre code) {
    background: transparent;
    padding: 0;
}
</style>
