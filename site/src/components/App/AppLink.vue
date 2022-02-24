<template>
    <router-link v-if="link.to" :to="link.to" v-bind="link.class ? { class: link.class } : {}">{{
        link.name
    }}</router-link>
    <a v-else :href="link.href" target="_blank" v-bind="link.class ? { class: link.class } : {}">{{
        link.name
    }}</a>
</template>
<script>
    export default {
        props: {
            link: {
                type: Object,
                default: () => ({}),
            },
        },
    }
</script>
