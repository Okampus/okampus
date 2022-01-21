<template>
    <div
        :class="[`bg-${tagColor}-100`, `hover:bg-${tagColor}-200`, `text-${tagColor}-700`]"
        class="bg-opacity-90 whitespace-normal hover:cursor-pointer py-1 px-3 rounded-full flex items-center gap-1.5"
    >
        <div>{{ tagName }}</div>
        <font-awesome-icon
            v-if="closable"
            class="text-sm"
            :icon="['fa', 'times']"
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
