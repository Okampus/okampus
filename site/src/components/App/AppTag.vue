<template>
    <div
        :class="[
            `bg-${tagColor}-100 dark:bg-${tagColor}-900`,
            `hover:bg-${tagColor}-200 dark:hover:bg-${tagColor}-800`,
            `text-${tagColor}-700 dark:text-${tagColor}-200`,
            large ? 'px-5 gap-3 py-2' : 'px-3 gap-1.5 py-1',
        ]"
        class="flex items-center whitespace-normal rounded-full cursor-pointer bg-opacity-/90"
    >
        <font-awesome-icon v-if="icon" :icon="icon" />
        <div>{{ tagName }}</div>
        <font-awesome-icon v-if="closable" class="text-sm" :icon="['fa', 'times']" @click="emit('close')" />
    </div>
</template>

<script setup>
    defineProps({
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
    })
    const emit = defineEmits(['close'])
</script>
