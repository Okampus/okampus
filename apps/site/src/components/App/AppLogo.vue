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
