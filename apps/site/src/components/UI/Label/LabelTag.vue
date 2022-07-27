<template>
    <div
        :class="[
            `bg-${tagColor.toLowerCase()}-100 dark:bg-${tagColor.toLowerCase()}-900`,
            `hover:bg-${tagColor.toLowerCase()}-200 dark:hover:bg-${tagColor.toLowerCase()}-800`,
            `text-${tagColor.toLowerCase()}-700 dark:text-${tagColor.toLowerCase()}-200`,
            large ? 'px-5 gap-3 py-1' : 'px-2 gap-1.5 py-0.5',
        ]"
        class="bg-opacity-/90 flex cursor-pointer items-center justify-center whitespace-normal rounded-full"
    >
        <i v-if="icon" :class="`fa fa-${icon}`" />
        <div v-if="tagName">{{ tagName }}</div>
        <i v-if="closable" class="fas text-base" :class="`fa-times`" @click="emit('close')" />
    </div>
</template>

<script setup>
    defineProps({
        tagName: {
            type: String,
            default: '',
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
