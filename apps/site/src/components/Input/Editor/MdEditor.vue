<template>
    <div>
        <textarea ref="editor" />
        <div v-if="cancellable || sendable" class="mt-2 flex flex-row items-center gap-4">
            <button v-if="cancellable" class="button-red" @click="emit('cancel')">Annuler</button>
            <template v-if="sendable">
                <div class="text-base">
                    <TipPopper
                        v-if="charCount < minCharCount"
                        :tip="`Tu dois au moins écrire ${minCharCount} caractères.`"
                    >
                        <button class="button-green" disabled>Envoyer</button>
                    </TipPopper>
                    <button v-else class="button-green" @click="emit('send')">Envoyer</button>
                </div>
            </template>
            <slot name="error" class="mt-2" />
        </div>
    </div>
</template>

<script setup>
    import EasyMDE from 'easymde'
    import TipPopper from '@/components/UI/Tip/TipPopper.vue'
    import { toRaw } from 'vue'

    import { onMounted, ref } from 'vue'

    const emit = defineEmits(['update:modelValue', 'cancel', 'send'])
    const props = defineProps({
        uid: {
            type: String,
            default: () => Math.random().toString(36).slice(2, 9),
        },
        cancellable: {
            type: Boolean,
            default: false,
        },
        sendable: {
            type: Boolean,
            default: false,
        },
        charCount: {
            type: Number,
            default: 0,
        },
        minCharCount: {
            type: Number,
            default: 10,
        },
        placeholder: {
            type: String,
            default: '',
        },
        modelValue: {
            default: null,
            type: String,
        },
    })

    const editor = ref(null)
    const charCount = ref(props.modelValue ? props.modelValue.length : 0)

    const mde = ref(null)
    const setMde = (val) => toRaw(mde.value.codemirror).setValue(val)

    defineExpose({
        charCount,
        editor,
        mde,
        setMde,
    })

    onMounted(() => {
        mde.value = new EasyMDE({
            autoDownloadFontAwesome: false,
            element: editor.value,
            initialValue: props.modelValue,
            maxHeight: '15rem',
            placeholder: props.placeholder,
        })

        mde.value.codemirror.on('change', () => {
            emit('update:modelValue', mde.value.value())
            charCount.value = mde.value.value().trim().length
        })
    })
</script>
