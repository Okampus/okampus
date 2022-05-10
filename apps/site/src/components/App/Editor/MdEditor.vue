<template>
    <div>
        <textarea ref="editor" />
        <div class="flex flex-row gap-4 items-center">
            <p
                v-if="cancellable"
                class="mt-2 text-base font-bold text-red-500 uppercase cursor-pointer"
                @click="emit('cancel')"
            >
                Annuler
            </p>
            <template v-if="sendable">
                <div class="mt-2 text-base font-bold tracking-wide">
                    <AppTip
                        v-if="charCount < minCharCount"
                        :tip="`Tu dois au moins écrire ${minCharCount} caractères.`"
                    >
                        <p class="text-gray-500 cursor-not-allowed">Envoyer</p>
                    </AppTip>

                    <p v-else class="text-blue-500 uppercase cursor-pointer" @click="emit('send')">Envoyer</p>
                </div>
            </template>
            <slot name="error" class="mt-2" />
        </div>
    </div>
</template>

<script setup>
    import EasyMDE from 'easymde'
    import AppTip from '../AppTip.vue'

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

    defineExpose({
        charCount,
        editor,
    })

    const mde = ref(null)
    onMounted(() => {
        console.log('editor', editor.value)
        mde.value = new EasyMDE({
            autoDownloadFontAwesome: false,
            element: editor.value,
            initialValue: props.modelValue,
            maxHeight: '15rem',
        })
        // editor.value.getMDEInstance()
        mde.value.codemirror.on('change', () => {
            emit('update:modelValue', mde.value.value())
            charCount.value = mde.value.value().trim().length
        })
    })
</script>
