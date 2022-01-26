<template>
    <div class="rounded-full shadow-inner">
        <img
            :src="src === '' || src === null || src === undefined ? defaultAvatar : src"
            :alt="alt"
            class="rounded-full"
            :class="`w-${size} h-${size}`"
        />
    </div>
</template>
<script>
    import defaultAvatar from '@/assets/img/default_avatars/user.png'
    export default {
        props: {
            src: {
                type: String,
                default: () => '',
            },
            alt: {
                type: String,
                default: () => '',
            },
            size: {
                type: Number,
                default: () => 16,
            },
        },
        data() {
            return { defaultAvatar: defaultAvatar }
        },
    }
</script>
<style></style>
