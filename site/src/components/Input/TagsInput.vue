<template>
    <div
        ref="tagsContainer"
        class="flex gap-2 flex-wrap items-center input w-full cursor-text h-max overflow-auto"
        tabindex="0"
        :="focused ? {'focused': 'true'} : {}"
        @focus="tagsInput.focus()"
    >
        <Tag
            v-for="(tag, idx) in tags"
            :key="idx"
            :tag-name="tag"
            :closable="true"
            class="mb-1"
            @close="removeTag(idx)"
        />
        <div class="flex-grow basis-0">
            <input
                ref="tagsInput"
                v-model="newTag"
                :placeholder="placeholder"
                class="placeholder h-8 min-w-[1em] bg-transparent outline-none w-full"
                @blur="focused = false"
                @focus="focused = true"
                @keydown="$emit('input-update', $event)"
                @keydown.enter.prevent="addTag(newTag)"
                @keydown.space.prevent="addTag(newTag)"
                @keydown.delete="newTag.length || removeTag(tags.length - 1)"
            >
        </div>
    </div>
</template>

<script>
import Tag from '@/components/ColoredTag.vue'

import { ref } from 'vue'
export default {
    components: {
        Tag
    },
    props: {
        placeholder: {
            type: String,
            default: 'Entrez des tags...'
        },
        modelValue: {
            type: Array,
            default: () => []
        }
    },
    emits: ['update:modelValue', 'error', 'input-update'],
    setup: (props, ctx) => {
        const tagsContainer = ref(null)
        const tagsInput = ref(null)
        const tags = ref(props.modelValue)
        const newTag = ref('')

        const addTag = (tag) => {
            if (tagsInput.value.placeholder) {
                tagsInput.value.placeholder = ''
            }

            if (tag.length) {
                if (tags.value.includes(tag)) {
                    ctx.emit('error', 'unique')
                } else {
                    tags.value.push(tag)
                    newTag.value = ''
                    ctx.emit('update:modelValue', tags)
                }
            } else {
                ctx.emit('error', 'empty')
            }
        }

        const removeTag = (index) => {
            tags.value.splice(index, 1)
            if (!tags.value.length) {
                tagsInput.value.placeholder = props.placeholder
            }
        }

        return { tags, newTag, addTag, removeTag, tagsContainer, tagsInput }
    },
    data() {
        return {
            focused: false
        }
    }
}
</script>
