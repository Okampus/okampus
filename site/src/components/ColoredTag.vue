<template>
    <div
        :class="[`bg-${tagColor}-100`, `hover:bg-${tagColor}-200`, `text-${tagColor}-700`]"
        class="whitespace-normal hover:cursor-pointer py-1 px-3 rounded-full flex items-center"
    >
        <div>{{ tagName }}</div>
        <i
            v-if="closable"
            class="ri-close-line text-lg pt-0.5 pl-1 -mr-1.5 -my-2"
            @click="$emit('close')"
        />
    </div>
</template>

<script lang="js">
export default {
    props: {
        tagName: {
            type: String,
            default: '<Vide>'
        },
        tagColor: {
            type: String,
            default: 'blue'
        },
        closable: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close']
}
</script>
