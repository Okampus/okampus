<template>
    <div
        :class="[`bg-${tagColor}-100`, `hover:bg-${tagColor}-200`, `text-${tagColor}-700`]"
        class="flex gap-1.5 items-center py-1 px-3 whitespace-normal rounded-full hover:cursor-pointer bg-opacity-/90"
    >
        <div>{{ tagName }}</div>
        <font-awesome-icon v-if="closable" class="text-sm" :icon="['fa', 'times']" @click="$emit('close')" />
    </div>
</template>

<script lang="js">
export default {
    props: {
        tagName: {
            type: String,
            default: '<Vide>',
        },
        tagColor: {
            type: String,
            default: 'blue',
        },
        closable: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['close'],
}
</script>
