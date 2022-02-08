<template>
    <router-link to="/" class="flex items-center cursor-pointer">
        <div class="w-10 h-10 logo" />
        <div class="w-24 h-5 brand" />
    </router-link>
</template>

<script>
    export default {
        props: {
            scale: {
                type: String,
                default: '1',
            },
        },
    }
</script>
