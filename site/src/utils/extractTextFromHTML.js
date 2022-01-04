import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'


export function extractTextFromHTML (s, space) {
    var span = document.createElement('span')
    span.innerHTML = s
    if (space) {
        var children = span.querySelectorAll('*')
        for (var i = 0; i < children.length; i++) {
            if (children[i].textContent) { children[i].textContent += ' ' } else { children[i].innerText += ' ' }
        }
    }
    return [span.textContent || span.innerText].toString().replace(/ +/g, ' ')
}

export function extractTextFromJSONBody (json) {
    return extractTextFromHTML(generateHTML(json || {},
        [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3]
                }
            }),
            Highlight,
            Typography,
            Placeholder,
            Underline,
            CharacterCount
        ]
    ), true)
}
