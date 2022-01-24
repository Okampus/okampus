<template>
    <div v-if="editor">
        <div
            v-if="editorButtons.length > 0"
            class="flex flex-wrap items-center py-2 px-1 space-x-2 border-color-4"
        >
            <template v-for="(btn, i) in editorButtons" :key="i">
                <Popper placement="top" :hover="true">
                    <div
                        :class="[
                            actionMap[btn.action].isActive &&
                            editor.isActive(...actionMap[btn.action].isActive)
                                ? 'bg-blue-500 border-indigo-800'
                                : 'bg-2',
                        ]"
                        class="flex items-center p-2 mr-3 text-lg rounded outline-none cursor-pointer text-1 icon-button raised"
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

        <div class="flex flex-row gap-4 items-center mt-2">
            <button v-if="cancellable" :class="textClass" class="button red" @click="$emit('cancel')">
                <p>Annuler</p>
            </button>
            <button v-if="sendable" :class="textClass" class="button" @click="$emit('send')">
                <p>Envoyer</p>
            </button>
            <slot name="error" />

            <!-- TODO: Refactor charCount (dark mode) -->
            <div
                v-if="charCount > 0 && getCharCount() >= charCountShowAt"
                class="flex"
                :class="[getCharCount() >= charCount ? 'text-red-400' : 'text-blue-400', textClass]"
            >
                <svg height="20" width="20" viewBox="0 0 20 20" class="mr-2">
                    <circle r="10" cx="10" cy="10" fill="#e9ecef" />
                    <circle
                        r="5"
                        cx="10"
                        cy="10"
                        fill="transparent"
                        stroke="currentColor"
                        stroke-width="10"
                        :stroke-dasharray="`${circleFillCharCount()} 999`"
                        transform="rotate(-90) translate(-20)"
                    />
                    <circle r="6" cx="10" cy="10" fill="white" />
                </svg>

                <div :class="{ 'text-slate-700': getCharCount() < charCount }">
                    {{ getCharCount() }}/{{ charCount }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="js">
import Popper from 'vue3-popper'
import {
    defaultEditorButtons, defaultTipTapText, getEditor,
} from '@/utils/tiptap'
import { EditorContent } from '@tiptap/vue-3'

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
        charCountShowAt: {
            type: Number,
            default: 0,
        },
        charCount: {
            type: Number,
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
    setup (props, ctx) {
        return {
            editor: getEditor({
                ctx,
                updateEvent: 'update:modelValue',
                content: props.modelValue,
                editorOptions: props.editorOptions,
                mode: props.mode,
                placeholder: props.placeholder,
                charCount: props.charCount,
                editorClasses: props.editorClasses,
            }),
        }
    },
    computed: {
        actionMap () {
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
    methods: {
        getCharCount () {
            return this.editor.storage.characterCount.characters()
        },
        circleFillCharCount () {
            return (Math.round((100 / this.charCount) * this.getCharCount()) * 31.4) / 100
        },
        getJSON () {
            return this.editor.getJSON()
        },
    },
}
</script>
