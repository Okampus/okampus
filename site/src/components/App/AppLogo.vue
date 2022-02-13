<template>
    <router-link to="/" class="flex items-center w-[8.5rem] cursor-pointer">
        <div class="w-[2.5rem] h-[2.5rem] logo" />
        <div class="w-[6rem] h-[1.25rem] brand" />
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
