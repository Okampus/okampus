<template>
    <p class="text-red-500">
        {{ error }}
    </p>
</template>

<script>
    export default {
        props: {
            error: {
                type: String,
                default: '<Error>',
            },
        },
    }
</script>
