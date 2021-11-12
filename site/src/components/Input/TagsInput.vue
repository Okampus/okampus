<template>
  <div
    ref="tagsContainer"
    class="flex flex-grow-0 flex-wrap items-center input input-border w-full cursor-text h-max"
    tabindex="0"
    :="focused ? {focused: ''} : {}"
    @focus="tagsInput.focus()"
  >
    <Tag
      v-for="(tag, idx) in tags"
      :key="idx"
      :name="tag"
      color="red-500"
    >
      <button
        class="text-white bg-opacity-0 outline-none border-none cursor-pointer font-bold text-lg"
        @click="removeTag(idx)"
      >
        <i class="ri-close-line" />
      </button>
    </Tag>
    <input
      ref="tagsInput"
      v-model="newTag"
      :placeholder="inputPlaceholder"
      class="placeholder h-8 min-w-1 w-full bg-opacity-0 flex-1 bg-white outline-none"
      @blur="focused = false"
      @focus="focused = true"
      @keydown="$emit('inputUpdate', $event)"
      @keydown.enter.prevent="addTag(newTag)"
      @keydown.space="addTag(newTag)"
      @keydown.delete="newTag.length || removeTag(tags.length - 1)"
    >
  </div>
</template>

<script>
import Tag from '@/components/Tag.vue'

import { ref } from 'vue'
export default {
  components: {
    Tag
  },
  props: {
    inputPlaceholder: {
      type: String,
      default: 'Entrez des tags...'
    },
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'error', 'inputUpdate'],
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
        tagsInput.value.placeholder = props.inputPlaceholder
      }
    }

    return { tags, newTag, addTag, removeTag, tagsContainer, tagsInput }
  },
  data: () => {
    return {
      focused: false
    }
  }
}
</script>
