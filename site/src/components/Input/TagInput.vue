<template>
    <div
        ref="tagsContainer"
        class="flex overflow-auto flex-wrap gap-2 items-center w-full h-max cursor-text input"
        tabindex="0"
        v-bind="focused ? { 'focused': 'true' } : {}"
        @focus="tagsInput.focus()"
    >
        <AppTag
            v-for="(tag, idx) in tags"
            :key="idx"
            :tag-name="tag"
            :closable="true"
            class="mb-1"
            @close="removeTag(idx)"
        />
        <div class="basis-0 grow">
            <input
                ref="tagsInput"
                v-model="newTag"
                :placeholder="placeholder"
                class="w-full min-w-[1em] h-8 bg-transparent outline-none placeholder"
                @blur="focused = false"
                @focus="focused = true"
                @keydown="keypress"
            />
        </div>
    </div>
</template>

<script setup>
    import AppTag from '@/components/App/AppTag.vue'
    import { ref } from 'vue'

    const props = defineProps({
        placeholder: {
            type: String,
            default: 'Entrez des tags...',
        },
        modelValue: {
            type: Array,
            default: () => [],
        },
    })

    const emit = defineEmits(['update:modelValue', 'error', 'input'])
    const focused = ref(false)

    const tagsContainer = ref(null)
    const tagsInput = ref(null)
    const tags = ref(props.modelValue)
    const newTag = ref('')

    const addTag = (tag) => {
        if (tag.length) {
            if (tags.value.includes(tag)) {
                emit('error', 'unique')
            } else {
                tags.value.push(tag)
                newTag.value = ''
                emit('update:modelValue', tags)
            }
            if (tagsInput.value.placeholder) {
                tagsInput.value.placeholder = ''
            }
        } else {
            emit('error', 'empty')
        }
    }

    const removeTag = (index) => {
        tags.value.splice(index, 1)
        if (!tags.value.length) {
            tagsInput.value.placeholder = props.placeholder
        }
    }

    const keypress = (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
            addTag(newTag.value)
            event.preventDefault()
        } else if (event.key === 'Backspace') {
            if (newTag.value.length === 0 && tags.value.length > 0) {
                removeTag(tags.value.length - 1)
            }
        } else {
            emit('input', event)
        }
    }
</script>
