<template>
    <router-link to="/" class="flex items-center cursor-pointer select-none">
        <div
            class="logo"
            :style="{
                width: `${scale * 7.5}rem`,
                height: `${scale * 2.5}rem`,
            }"
            :="only === 'none' ? { 'allow-dark': '' } : only === 'dark' ? { 'dark': '' } : {}"
        />
        <div class="px-[0.1rem] mr-[0.5rem] ml-[0.3rem] text-xs font-bold text-2-light bg-0-light rounded">
            BETA
        </div>
        <!-- <img
            src="@/assets/img/logos/brand.png"
            alt=""
            class="w-[5rem]"
            :class="
                only === 'none'
                    ? 'brightness-0 dark:brightness-100'
                    : only === 'dark'
                    ? 'brightness-100'
                    : 'brightness-0'
            "
        /> -->
    </router-link>
</template>

<script>
    export default {
        props: {
            scale: {
                type: Number,
                default: 1,
            },
            only: {
                type: String,
                default: 'none',
            },
        },
    }
</script>
