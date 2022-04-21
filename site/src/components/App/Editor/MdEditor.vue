<template>
    <div>
        <textarea ref="editor" />
        <!-- <vue-easymde
            ref="editor"
            :model-value="props.modelValue"
            :options="{ maxHeight: '15rem' }"
            @update:model-value="(value) => emit('update:modelValue', value)"
        /> -->
        <div class="flex flex-row gap-4 items-center">
            <p
                v-if="cancellable"
                class="mt-2 text-base font-bold text-red-500 uppercase cursor-pointer"
                @click="emit('cancel')"
            >
                Annuler
            </p>
            <Popper :hover="true" placement="top" :arrow="true" offset-distance="3">
                <p
                    v-if="sendable"
                    class="mt-2 text-base font-bold tracking-wide uppercase"
                    :class="[
                        charCount > minCharCount
                            ? 'text-blue-500 cursor-pointer'
                            : 'text-gray-500 cursor-not-allowed',
                    ]"
                    @click="charCount > minCharCount ? emit('send') : null"
                >
                    Envoyer
                </p>
                <template v-if="charCount < minCharCount" #content>
                    <div class="card-tip">Tu dois au moins écrire {{ minCharCount }} caractères.</div>
                </template>
            </Popper>
            <slot name="error" class="mt-2" />
        </div>
        {{ props.modelValue }}
    </div>
</template>

<script setup>
    import Popper from 'vue3-popper'
    import EasyMDE from 'easymde'

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
