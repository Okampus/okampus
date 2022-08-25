<template>
    <ModalPopup :show="show" @close="emit('update:show', false)">
        <div class="flex flex-col gap-4">
            <div v-for="[field, value] in Object.entries(formSubmission ?? {})" :key="field">
                <div class="text-base text-gray-400/80">{{ capitalize(field) }}</div>
                <div class="text-0 text-xl">{{ value }}</div>
            </div>
            <slot />
            <button class="button-grey" @click="emit('update:show', false)">Fermer</button>
        </div>
    </ModalPopup>
</template>

<script setup>
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'

    import { capitalize } from 'lodash'

    defineProps({
        show: {
            type: Boolean,
            required: true,
        },
        formSubmission: {
            type: Object,
            default: () => ({}),
        },
    })

    const emit = defineEmits(['update:show'])
</script>
