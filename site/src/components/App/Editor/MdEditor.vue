<template>
    <div>
        <span ref="editorEl" />
        <div class="flex flex-row gap-4 items-center">
            <p
                v-if="cancellable"
                class="mt-2 text-base font-bold text-red-500 uppercase cursor-pointer"
                @click="$emit('cancel')"
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
                    @click="charCount > minCharCount ? $emit('send') : null"
                >
                    Envoyer
                </p>
                <template v-if="charCount < minCharCount" #content>
                    <div class="card-tip">Tu dois au moins écrire {{ minCharCount }} caractères.</div>
                </template>
            </Popper>
            <slot name="error" class="mt-2" />
        </div>
    </div>
</template>

<script setup>
    import Popper from 'vue3-popper'
    import Vditor from 'vditor'

    import { onMounted, ref, watch } from 'vue'

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

    const editorEl = ref(null)
    const editor = ref(null)
    const charCount = ref(0)

    defineExpose({
        editor,
        charCount,
    })

    // TODO: upload
    // TODO: custom toolbar
    // TODO: fix relative links
    onMounted(() => {
        editor.value = new Vditor(editorEl.value, {
            // toolbar,
            lang: 'en_US',
            counter: {
                enable: true,
                max: props.charCount > 0 ? props.charCount : null,
                type: 'markdown',
                after: (length) => {
                    charCount.value = length
                },
            },
            cache: {
                id: props.uid,
                after: (value) => {
                    emit('update:modelValue', value)
                },
            },
            input: (value) => {
                emit('update:modelValue', value)
                console.log(value, props.modelValue)
            },
            placeholder: props.placeholder ?? '',
            height: 300,
            preview: {
                actions: [],
                markdown: {
                    toc: true,
                    mark: true,
                    footnotes: true,
                    autoSpace: true,
                },
            },
            toolbarConfig: {
                pin: true,
            },
        })
    })

    watch(
        () => props.modelValue,
        (value) => {
            if (editor.value) {
                editor.value.setValue(value)
            }
        },
    )
</script>
