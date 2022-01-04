<template>
    <span
        class="
        h-7 rounded-md text-white
        font-medium mr-1 px-1  opacity-80
        cursor-pointer hover:opacity-100
        md:mr-2 md:px-3 inline-flex items-center
        text-base whitespace-nowrap
    "
        :style="{backgroundColor: color}"
    >

        {{ tagName }}
        <slot />
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
            default: 'orange'
        }
    }
}
</script>
