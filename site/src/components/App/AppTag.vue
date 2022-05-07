<template>
    <div
        :class="[
            `bg-${tagColor}-100 dark:bg-${tagColor}-900`,
            `hover:bg-${tagColor}-200 dark:hover:bg-${tagColor}-800`,
            `text-${tagColor}-700 dark:text-${tagColor}-200`,
            large ? 'px-5 gap-3 py-2' : 'px-3 gap-1.5 py-1',
        ]"
        class="flex justify-center items-center whitespace-normal rounded-full cursor-pointer bg-opacity-/90"
    >
        <i v-if="icon" :class="`fa fa-${icon}`" />
        <div v-if="tagName">{{ tagName }}</div>
        <i v-if="closable" class="text-sm fas" :class="`fa-times`" @click="emit('close')" />
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
