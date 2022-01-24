<template>
    <p class="text-red-500">
        {{ error }}
    </p>
</template>

<script lang="js">
export default {
    props: {
        error: {
            type: String,
            default: '<Error>',
        },
    },
}
</script>
