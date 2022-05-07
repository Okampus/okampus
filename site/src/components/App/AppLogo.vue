<template>
    <router-link to="/" class="flex items-center cursor-pointer select-none">
        <div
            class="mr-[0.5rem] w-[2.5rem] h-[2.5rem] logo"
            :="only === 'none' ? { 'allow-dark': '' } : only === 'dark' ? { 'dark': '' } : {}"
        />
        <img
            src="@/assets/img/logos/horizon_brand.png"
            alt=""
            class="w-[5rem]"
            :class="
                only === 'none'
                    ? 'brightness-0 dark:brightness-100'
                    : only === 'dark'
                    ? 'brightness-100'
                    : 'brightness-0'
            "
        />
    </router-link>
</template>

<script>
    export default {
        props: {
            scale: {
                type: String,
                default: '1',
            },
            only: {
                type: String,
                default: 'none',
            },
        },
    }
</script>
