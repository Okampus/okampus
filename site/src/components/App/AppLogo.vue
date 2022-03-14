<template>
    <router-link to="/" class="flex items-center cursor-pointer">
        <div class="mr-[0.5rem] w-[2.5rem] h-[2.5rem] logo" />
        <img
            src="@/assets/img/logos/horizon_brand.png"
            alt=""
            class="w-[5rem] brightness-0 dark:brightness-100"
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
        },
    }
</script>
