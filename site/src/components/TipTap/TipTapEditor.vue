<template>
    <div v-if="editor">
        <div
            v-if="buttons.length > 0"
            class="space-x-2 px-1 py-3 flex flex-wrap items-center border-color-4"
            :class="buttonClasses"
        >
            <template
                v-for="(btn, i) in buttons"
                :key="i"
            >
                <v-popper
                    placement="top"
                    :hover="true"
                >
                    <div
                        :class="
                            actionMap[btn.action].isActive
                                ? {
                                    'is-active': editor.isActive(...actionMap[btn.action].isActive),
                                }
                                : {}
                        "
                        class="text-1 flex items-center icon-button mr-3"
                        @click="actionMap[btn.action].action()"
                    >
                        <i
                            :class="btn.icon"
                        />
                    </div>
                    <template #content>
                        <div class="popover">
                            {{ btn.content }}
                        </div>
                    </template>
                </v-popper>
            </template>
        </div>

        <editor-content
            class="editor"
            :editor="editor"
        />

        <div class="flex mt-2 gap-4 items-center">
            <div
                v-if="charCount"
                :class="{
                    'character-count': charCount,
                    'character-count--warning':
                        getCharCount() === charCountLimit,
                }"
            >
                <svg
                    height="20"
                    width="20"
                    viewBox="0 0 20 20"
                    class="character-count__graph"
                >
                    <circle
                        r="10"
                        cx="10"
                        cy="10"
                        fill="#e9ecef"
                    />
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
                    <circle
                        r="6"
                        cx="10"
                        cy="10"
                        fill="white"
                    />
                </svg>

                <div
                    :class="{'character-count__text':
                        getCharCount() !== charCountLimit}"
                >
                    {{ getCharCount() }}/{{ charCountLimit }} characters
                </div>
            </div>

            <button
                v-if="cancellable"
                class="button red"
                @click="$emit('cancel')"
            >
                <p>
                    Annuler
                </p>
            </button>
            <button
                v-if="sendable"
                class="button"
                @click="$emit('send')"
            >
                <p>
                    Envoyer
                </p>
            </button>
            <slot name="error" />
        </div>
    </div>
</template>

<script lang="js">
import { useEditor, EditorContent, generateHTML } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'

export default {
    components: {
        EditorContent
    },
    props: {
        buttons: {
            type: Array,
            default: () => []
        },
        buttonClasses: {
            type: String,
            default: () => ''
        },
        placeholder: {
            type: String,
            default: 'Écrivez votre texte ici...'
        },
        cancellable: {
            type: Boolean,
            default: false
        },
        sendable: {
            type: Boolean,
            default: false
        },
        mode: {
            type: String,
            default: 'json'
        },
        editorClasses: {
            type: Array,
            default: () => ['min-h-20']
        },
        charCount: Boolean,
        charCountLimit: {
            type: Number,
            default: 250
        },
        modelValue: {
            default: '{"type":"doc","content":[{"type":"paragraph"}]}',
            type: String
        }
    },
    emits: ['update:modelValue', 'cancel', 'send'],
    setup (props, ctx) {
        const extensions = [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                }
            }),
            Highlight,
            Typography,
            Placeholder.configure({
                placeholder: props.placeholder
            }),
            Underline
        ]

        if (props.charCount) {
            extensions.push(CharacterCount.configure({
                limit: props.charCountLimit
            }))
        }

        const editor = useEditor({
            content:  props.mode === 'json' ? JSON.parse(props.modelValue) : generateHTML(props.modelValue),
            onUpdate: function () {
                ctx.emit('update:modelValue', props.mode === 'json' ? JSON.stringify(this.getJSON()) : this.getHTML())
            },
            extensions,
            editorProps: {
                attributes: {
                    class: props.editorClasses.join(' ')
                }
            }
        })

        return {
            editor
        }
    },
    computed: {
        actionMap () {
            return {
                paragraph: {
                    action: () => this.editor.chain().focus().setParagraph().run(),
                    isActive: ['paragraph']
                },
                bold: {
                    action: () => this.editor.chain().focus().toggleBold().run(),
                    isActive: ['bold']
                },
                highlight: {
                    action: () => this.editor.chain().focus().toggleHighlight().run(),
                    isActive: ['highlight']
                },
                italic: {
                    action: () => this.editor.chain().focus().toggleItalic().run(),
                    isActive: ['italic']
                },
                underline: {
                    action: () => this.editor.chain().focus().toggleUnderline().run(),
                    isActive: ['underline']
                },
                strike: {
                    action: () => this.editor.chain().focus().toggleStrike().run(),
                    isActive: ['strike']
                },
                code: {
                    action: () => this.editor.chain().focus().toggleCode().run(),
                    isActive: ['code']
                },
                clearMarks: {
                    action: () => this.editor.chain().focus().unsetAllMarks().run()
                },
                clearNodes: {
                    action: () => this.editor.chain().focus().clearNodes().run()
                },
                h1: {
                    action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
                    isActive: ['heading', { level: 1 }]
                },
                h2: {
                    action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
                    isActive: ['heading', { level: 2 }]
                },
                h3: {
                    action: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
                    isActive: ['heading', { level: 3 }]
                },
                h4: {
                    action: () => this.editor.chain().focus().toggleHeading({ level: 4 }).run(),
                    isActive: ['heading', { level: 4 }]
                },
                h5: {
                    action: () => this.editor.chain().focus().toggleHeading({ level: 5 }).run(),
                    isActive: ['heading', { level: 5 }]
                },
                h6: {
                    action: () => this.editor.chain().focus().toggleHeading({ level: 6 }).run(),
                    isActive: ['heading', { level: 6 }]
                },
                bulletList: {
                    action: () => this.editor.chain().focus().toggleBulletList().run(),
                    isActive: ['bulletList']
                },
                orderedList: {
                    action: () => this.editor.chain().focus().toggleOrderedList().run(),
                    isActive: ['orderedList']
                },
                codeBlock: {
                    action: () => this.editor.chain().focus().toggleCodeBlock().run(),
                    isActive: ['codeBlock']
                },
                blockquote: {
                    action: () => this.editor.chain().focus().toggleBlockquote().run(),
                    isActive: ['blockquote']
                },
                horizontalRule: {
                    action: () => this.editor.chain().focus().setHorizontalrule().run()
                },
                hardBreak: {
                    action: () => this.editor.chain().focus().setHardBreak().run()
                },
                undo: {
                    action: () => this.editor.chain().focus().undo().run()
                },
                redo: {
                    action: () => this.editor.chain().focus().redo().run()
                }
            }
        }
    },
    methods: {
        getCharCount () {
            return this.editor.storage.characterCount.characters()
        },
        circleFillCharCount () {
            return (Math.round((100 / this.charCountLimit) * this.getCharCount()) * 31.4) / 100
        },
        getJSON () {
            return this.editor.getJSON()
        }
    }
}
</script>

<style lang="scss">
.character-count {
    display: flex;
    align-items: center;
    color: #68cef8;

    &--warning {
        color: #fb5151;
    }

    &__graph {
        margin-right: 0.5rem;
    }

    &__text {
        color: #868e96;
    }
}

.icon-button {
    @apply p-2 outline-none cursor-pointer rounded border shadow;
}

.icon-button.is-active {
    @apply bg-blue-500 border-indigo-800 dark:shadow-none;
}
</style>
