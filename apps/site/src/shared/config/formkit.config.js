import FormKitRadioInput from '@/components/Input/FormKit/FormKitRadioInput.vue'
import FormKitMdEditor from '@/components/Input/FormKit/FormKitMdEditor.vue'
import FormKitTagInput from '@/components/Input/FormKit/FormKitTagInput.vue'
import FormKitFloatingLabelText from '@/components/Input/FormKit/FormKitFloatingLabelText.vue'
import FormKitSearchInput from '@/components/Input/FormKit/FormKitSearchInput.vue'
import FormKitDropdownInput from '@/components/Input/FormKit/FormKitDropdownInput.vue'
import FormKitMultiselectInput from '@/components/Input/FormKit/FormKitMultiselectInput.vue'

import { defaultConfig, createInput } from '@formkit/vue'
import { generateClasses } from '@formkit/themes'
import formkitTheme from '@/formkit.theme'
import { fr } from '@formkit/i18n'

const isCheckboxAndRadioMultiple = (node) =>
    (node.props.type === 'checkbox' || node.props.type === 'radio') && node.props.options

const starLabel = {
    children: [
        '$label',
        {
            $el: 'span',
            children: ['*'],
            attrs: { style: { color: 'red', fontSize: '1.4rem', paddingLeft: '2px' } },
        },
    ],
}
function addAsteriskPlugin(node) {
    node.on('created', () => {
        const schemaFn = node.props.definition.schema
        node.props.definition.schema = (sectionsSchema = {}) => {
            const isRequired = node.props.parsedRules.some((rule) => rule.name === 'required')
            if (isRequired) sectionsSchema[isCheckboxAndRadioMultiple(node) ? 'legend' : 'label'] = starLabel

            return schemaFn(sectionsSchema)
        }
    })

    node.on('prop', (prop) => {
        if (prop.payload.prop === 'parsedRules') node.emit('schema')
    })
}

export default defaultConfig({
    inputs: {
        tabs: createInput(FormKitRadioInput, {
            props: ['choices', 'choice'],
        }),
        editor: createInput(FormKitMdEditor, {
            props: ['uid', 'charCount', 'minCharCount', 'placeholder'],
        }),
        tags: createInput(FormKitTagInput, {
            props: ['placeholder'],
        }),
        floating: createInput(FormKitFloatingLabelText, {
            props: ['placeholder', 'floatingLabel', 'inputClass', 'inputType', 'isTextarea'],
        }),
        multisearch: createInput(FormKitSearchInput, {
            props: ['placeholder', 'searchQuery', 'queryName', 'disabled'],
        }),
        dropdown: createInput(FormKitDropdownInput, {
            props: ['placeholder', 'defaultOption', 'options', 'update'],
        }),
        multiselect: createInput(FormKitMultiselectInput, {
            props: [
                'options',
                'disabled',
                'placeholder',
                'singleSelectPrefix',
                'groupLabel',
                'groupValues',
                'multiple',
                'showMultipleBelow',
                'limit',
                'searchable',
                'allowEmpty',
            ],
        }),
    },
    locales: { fr },
    locale: 'fr',
    config: {
        classes: generateClasses(formkitTheme),
    },
    plugins: [addAsteriskPlugin],
})
