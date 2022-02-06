<template>
    <div
        :class="[
            `bg-${tagColor}-100`,
            `hover:bg-${tagColor}-200`,
            `text-${tagColor}-700`,
            large ? 'px-5 gap-3 py-2' : 'px-3 gap-1.5 py-1',
        ]"
        class="flex items-center whitespace-normal rounded-full hover:cursor-pointer bg-opacity-/90"
    >
        <font-awesome-icon v-if="icon" :icon="icon" />
        <div>{{ tagName }}</div>
        <font-awesome-icon v-if="closable" class="text-sm" :icon="['fa', 'times']" @click="$emit('close')" />
    </div>
</template>

<script>
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
            icon: {
                type: [String, Array],
                default: '',
            },
            closable: {
                type: Boolean,
                default: false,
            },
            large: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['close'],
    }
</script>
