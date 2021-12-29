<template>
    <span
        class="
        h-7 rounded-full text-white
        font-medium mr-1 px-2  bg-opacity-80
        cursor-pointer hover:bg-opacity-100
        md:mr-2 md:px-4 inline-block
        text-base whitespace-nowrap
    "
        :style="{backgroundColor: color}"
    >
        {{ tagName }}
    </span>
</template>

<script lang="js">
export default {
    props: {
        tagName: {
            type: String,
            default: '<Vide>'
        },
        color: {
            type: String,
            default: '#ef4444'
        }
    }
}
</script>
