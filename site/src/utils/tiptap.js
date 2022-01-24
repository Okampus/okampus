import { generateHTML } from '@tiptap/vue-3'
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'

export const defaultTipTapText = '{"type":"doc","content":[{"type":"paragraph"}]}'
export const defaultStarterKit = StarterKit.configure({ heading: { levels: [1, 2, 3] } })

export const defaultLink = Link.configure({ HTMLAttributes: { class: 'link-blue' } })

export const defaultTipTapExtensions = [defaultStarterKit, defaultLink, Highlight, Typography, Underline]

export function getEditor({
    extensions = [...defaultTipTapExtensions],
    editorOptions = {},
    editorClasses = '',
    placeholder = 'Écrivez ici...',
    mode = 'json',
    updateEvent = 'update:modelValue',
    ctx = {},
    content = null,
    charCount = 0,
}) {
    let onUpdate = () => {}

    if (ctx !== {}) {
        onUpdate = function () {
            ctx.emit(updateEvent, mode === 'json' ? JSON.stringify(this.getJSON()) : this.getHTML())
        }
    }

    if (content === null || content === undefined || content === '') {
        content = JSON.parse(defaultTipTapText)
    } else if (mode === 'html') {
        try {
            content = generateHTML(content)
        } catch {
            content = `<p>${content}</p>`
        }
    } else {
        try {
            content = JSON.parse(content)
        } catch (err) {
            content = JSON.parse(defaultTipTapText)
        }
    }

    if (placeholder) {
        extensions.push(Placeholder.configure({ placeholder }))
    }

    if (charCount > 0) {
        extensions.push(CharacterCount.configure({ limit: charCount }))
    }

    if (editorClasses) {
        editorOptions.editorProps = { attributes: { class: editorClasses } }
    }

    return useEditor({
        extensions,
        ...editorOptions,
        onUpdate,
        content,
    })
}

export const defaultEditorButtons = [
    {
        action: 'paragraph',
        icon: 'paragraph',
        content: 'Paragraphe (Ctrl+Alt+0)',
    },
    {
        action: 'bold',
        icon: 'bold',
        content: 'Gras (Ctrl+B)',
    },
    {
        action: 'italic',
        icon: 'italic',
        content: 'Italique (Ctrl+I)',
    },
    {
        action: 'strike',
        icon: 'strikethrough',
        content: 'Barré (Ctrl+Shift+X)',
    },
    {
        action: 'underline',
        icon: 'underline',
        content: 'Souligné (Ctrl+U)',
    },
    {
        action: 'highlight',
        icon: 'highlighter',
        content: 'Surligné (Ctrl+Shift+H)',
    },
    {
        action: 'clearMarks',
        icon: 'trash',
        content: 'Enlever les styles',
    },
]

export function extractTextFromHTML(html, space) {
    const span = document.createElement('span')

    span.innerHTML = html

    if (space) {
        // add a space after each span element
        span.querySelectorAll('*').forEach((el) => {
            el.textContent = el.textContent ? el.textContent + ' ' : ''
            el.innerText = el.innerText ? el.innerText + ' ' : ''
        })
    }

    return [span.textContent || span.innerText]
        .toString() // get text from span and convert to string
        .replace(/ +/g, ' ') // remove multiple spaces
}

export function extractTextFromTipTapJSON(
    json = defaultTipTapText,
    extensions = defaultTipTapExtensions,
    space = true,
) {
    return extractTextFromHTML(generateHTML(json, extensions), space)
}
