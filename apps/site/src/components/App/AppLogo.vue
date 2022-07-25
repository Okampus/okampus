<template>
    <router-link to="/" class="flex cursor-pointer select-none items-center">
        <div
            class="logo"
            :style="{
                width: `${scale * 7.4}rem`,
                height: `${scale * 2.4}rem`,
            }"
            :="only === 'none' ? { 'allow-dark': '' } : only === 'dark' ? { 'dark': '' } : {}"
        />
        <div class="ml-[0.3rem] rounded bg-0-light px-[0.1rem] text-[8px] font-bold text-2-light">BETA</div>
    </router-link>
</template>

<script setup>
    defineProps({
        scale: {
            type: Number,
            default: 1,
        },
        only: {
            type: String,
            default: 'none',
        },
    })
</script>
