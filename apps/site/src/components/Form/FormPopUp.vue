<template>
    <ModalPopup :show="show" @close="emit('update:show', false)" @closed="emit('closed')">
        <template #default="{ close }">
            <div class="card-0 flex flex-col items-center justify-center gap-6 py-8 px-10">
                <FormKit ref="form" type="form" :actions="false" @submit="submit($event)">
                    <FormKitSchema :schema="formSchema" :data="formData" />
                </FormKit>

                <div class="flex gap-4 self-end">
                    <button class="button-grey" @click="close">Annuler</button>
                    <button
                        class="flex items-center gap-2"
                        :class="submitButton.class ?? 'button-blue'"
                        @click="form.node.submit()"
                    >
                        <i v-if="submitButton.icon" class="text-lg" :class="`fa fa-${submitButton.icon}`" />
                        <div>{{ submitButton.label ?? 'Confirmer' }}</div>
                    </button>
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup>
    import ModalPopup from '@/components/UI/Modal/ModalPopup.vue'
    import { FormKitSchema } from '@formkit/vue'

    import { ref } from 'vue'

    defineProps({
        show: {
            type: Boolean,
            required: true,
        },
        formData: {
            type: Object,
            default: () => ({}),
        },
        formSchema: {
            type: Object,
            default: () => ({}),
        },
        submit: {
            type: Function,
            required: true,
        },
        submitButton: {
            type: Object,
            default: () => ({}),
        },
    })

    const emit = defineEmits(['update:show', 'closed'])
    const form = ref(null)
</script>
