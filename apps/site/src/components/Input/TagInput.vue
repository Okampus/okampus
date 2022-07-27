<template>
    <div class="relative">
        <div
            ref="tagsContainer"
            class="input flex h-max w-full cursor-text flex-wrap items-center gap-2 overflow-auto"
            tabindex="0"
            v-bind="focused ? { 'focused': 'true' } : {}"
            @focus="tagsInput.focus(), (focused = true)"
        >
            <LabelTag
                v-for="(tag, idx) in tags"
                :key="idx"
                :tag-name="tag"
                :closable="true"
                @close="removeTag(idx)"
            />
            <div class="grow basis-0">
                <input
                    ref="tagsInput"
                    v-model="newTag"
                    :placeholder="
                        focused || tags.length || newTag ? placeholder : floatingLabel ? '' : placeholder
                    "
                    class="placeholder h-8 w-full min-w-[1em] bg-transparent outline-none"
                    @blur="focused = false"
                    @focus="focused = true"
                    @keydown="keypress"
                />
            </div>
        </div>
        <div
            v-if="floatingLabel"
            :class="{ 'floating': focused || tags.length || newTag }"
            class="floating-label bg-2 rounded-t-md px-1"
        >
            {{ floatingLabel }}
        </div>
    </div>
</template>

<script setup>
    import LabelTag from '@/components/UI/Label/LabelTag.vue'

    import { ref } from 'vue'

    const props = defineProps({
        placeholder: {
            type: String,
            default: 'Entrez des tags...',
        },
        floatingLabel: {
            type: String,
            default: 'Tags',
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
