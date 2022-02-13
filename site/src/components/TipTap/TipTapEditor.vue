<template>
    <div v-if="editor">
        <div
            v-if="editorButtons.length > 0"
            class="flex overflow-hidden flex-wrap items-center p-[2px] rounded-t bg-0"
        >
            <template v-for="(btn, i) in editorButtons" :key="i">
                <Popper placement="top" :hover="true">
                    <div
                        :class="[
                            actionMap[btn.action].isActive &&
                            editor.isActive(...actionMap[btn.action].isActive)
                                ? 'text-0 bg-2'
                                : 'text-3 bg-0',
                        ]"
                        class="flex items-center p-3 text-lg outline-none cursor-pointer"
                        @click="actionMap[btn.action].action()"
                    >
                        <font-awesome-icon :icon="btn.icon" class="mr-1" />
                    </div>
                    <template #content>
                        <div class="popover">
                            {{ btn.content }}
                        </div>
                    </template>
                </Popper>
            </template>
        </div>

        <EditorContent class="editor" :editor="editor" />

        <div class="flex flex-row gap-4 items-center">
            <p
                v-if="cancellable"
                class="mt-2 font-bold text-red-500 uppercase cursor-pointer"
                :class="textClass"
                @click="$emit('cancel')"
            >
                Annuler
            </p>

            <!-- TODO: validate on send -->
            <p
                v-if="sendable"
                class="mt-2 font-bold tracking-wide uppercase"
                :class="[
                    getCharCount() > 0 ? 'text-blue-500 cursor-pointer' : 'text-gray-500 cursor-not-allowed',
                    textClass,
                ]"
                @click="getCharCount() > 0 ? $emit('send') : null"
            >
                Envoyer
            </p>

            <slot name="error" class="mt-2" />

            <div
                v-if="charCount > 0 && getCharCount() >= (charCount?.showAt ?? 0)"
                class="flex mt-2"
                :class="[getCharCount() >= charCount ? 'text-red-400' : 'text-blue-400', textClass]"
            >
                <svg height="20" width="20" viewBox="0 0 20 20" class="mr-2">
                    <circle
                        :r="charCountCircleRadius"
                        cx="10"
                        cy="10"
                        fill="none"
                        stroke-width="4"
                        stroke="gray"
                    />
                    <circle
                        :r="charCountCircleRadius"
                        cx="10"
                        cy="10"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="4"
                        :stroke-dasharray="`${circleFillCharCount()} 999`"
                        transform="rotate(-90) translate(-20)"
                    />
                </svg>

                <div :class="{ 'text-2': getCharCount() < charCount }">
                    {{ getCharCount() }}/{{ charCount }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Popper from 'vue3-popper'
    import { defaultEditorButtons, defaultTipTapText, getEditor } from '@/utils/tiptap'
    import { EditorContent } from '@tiptap/vue-3'
    import { watch } from 'vue'

    export default {
        components: {
            EditorContent,
            Popper,
        },
        props: {
            cancellable: {
                type: Boolean,
                default: false,
            },
            sendable: {
                type: Boolean,
                default: false,
            },
            textClass: {
                type: String,
                default: 'text-base',
            },
            editorButtons: {
                type: Array,
                default: defaultEditorButtons,
            },
            editorOptions: {
                type: Object,
                default: () => ({}),
            },
            placeholder: {
                type: String,
                default: '',
            },
            mode: {
                type: String,
                default: 'json',
            },
            charCount: {
                type: [Number, Object],
                default: 0,
            },
            editorClasses: {
                type: Array,
                default: () => ['min-h-20'],
            },
            modelValue: {
                default: defaultTipTapText,
                type: String,
            },
        },
        emits: ['update:modelValue', 'cancel', 'send'],
        setup(props, ctx) {
            return {
                editor: getEditor({
                    ctx,
                    updateEvent: 'update:modelValue',
                    content: props.modelValue,
                    editorOptions: props.editorOptions,
                    mode: props.mode,
                    placeholder: props.placeholder,
                    charCount: props.charCount?.limit ?? props.charCount,
                    editorClasses: props.editorClasses,
                }),
            }
        },
        data: function () {
            return {
                charCountCircleRadius: 7,
            }
        },
        computed: {
            dark() {
                return this.$store.state.user.theme === 'dark'
            },
            actionMap() {
                return {
                    paragraph: {
                        action: () => this.editor.chain().focus().setParagraph().run(),
                        isActive: ['paragraph'],
                    },
                    bold: {
                        action: () => this.editor.chain().focus().toggleBold().run(),
                        isActive: ['bold'],
                    },
                    highlight: {
                        action: () => this.editor.chain().focus().toggleHighlight().run(),
                        isActive: ['highlight'],
                    },
                    italic: {
                        action: () => this.editor.chain().focus().toggleItalic().run(),
                        isActive: ['italic'],
                    },
                    underline: {
                        action: () => this.editor.chain().focus().toggleUnderline().run(),
                        isActive: ['underline'],
                    },
                    strike: {
                        action: () => this.editor.chain().focus().toggleStrike().run(),
                        isActive: ['strike'],
                    },
                    code: {
                        action: () => this.editor.chain().focus().toggleCode().run(),
                        isActive: ['code'],
                    },
                    clearMarks: { action: () => this.editor.chain().focus().unsetAllMarks().run() },
                    clearNodes: { action: () => this.editor.chain().focus().clearNodes().run() },
                    h1: {
                        action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
                        isActive: ['heading', { level: 1 }],
                    },
                    h2: {
                        action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
                        isActive: ['heading', { level: 2 }],
                    },
                    h3: {
                        action: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
                        isActive: ['heading', { level: 3 }],
                    },
                    h4: {
                        action: () => this.editor.chain().focus().toggleHeading({ level: 4 }).run(),
                        isActive: ['heading', { level: 4 }],
                    },
                    h5: {
                        action: () => this.editor.chain().focus().toggleHeading({ level: 5 }).run(),
                        isActive: ['heading', { level: 5 }],
                    },
                    h6: {
                        action: () => this.editor.chain().focus().toggleHeading({ level: 6 }).run(),
                        isActive: ['heading', { level: 6 }],
                    },
                    bulletList: {
                        action: () => this.editor.chain().focus().toggleBulletList().run(),
                        isActive: ['bulletList'],
                    },
                    orderedList: {
                        action: () => this.editor.chain().focus().toggleOrderedList().run(),
                        isActive: ['orderedList'],
                    },
                    codeBlock: {
                        action: () => this.editor.chain().focus().toggleCodeBlock().run(),
                        isActive: ['codeBlock'],
                    },
                    blockquote: {
                        action: () => this.editor.chain().focus().toggleBlockquote().run(),
                        isActive: ['blockquote'],
                    },
                    horizontalRule: { action: () => this.editor.chain().focus().setHorizontalrule().run() },
                    hardBreak: { action: () => this.editor.chain().focus().setHardBreak().run() },
                    undo: { action: () => this.editor.chain().focus().undo().run() },
                    redo: { action: () => this.editor.chain().focus().redo().run() },
                }
            },
        },
        mounted() {
            watch(
                () => this.modelValue,
                (newValue) => {
                    if (this.mode === 'json') {
                        if (newValue !== JSON.stringify(this.editor.getJSON())) {
                            this.editor.commands.setContent(JSON.parse(newValue))
                        }
                    } else if (newValue !== this.editor.getHTML()) {
                        this.editor.commands.setContent(newValue)
                    }
                },
            )
        },
        methods: {
            getCharCount() {
                return this.editor.storage?.characterCount?.characters() ?? 0
            },
            circleFillCharCount() {
                return (
                    (this.getCharCount() / (this.charCount?.limit ?? this.charCount)) *
                    2 *
                    Math.PI *
                    this.charCountCircleRadius
                )
            },
            getJSON() {
                return this.editor.getJSON()
            },
        },
    }
</script>
