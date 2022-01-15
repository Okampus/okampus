<template>
    <div
        :class="[`bg-${color}-100`, `hover:bg-${color}-200`, `text-${color}-700`]"
        class="whitespace-normal hover:cursor-pointer py-1 px-3 rounded-full inline-block"
    >
        {{ tagName }}
        <slot />
    </div>
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
            default: 'blue'
        }
    }
}
</script>
