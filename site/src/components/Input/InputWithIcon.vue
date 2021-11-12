<template>
  <div class="flex flex-row text-gray-600 focus-within:text-gray-900 dark:text-gray-400 dark:focus-within:text-white">
    <i
      class="flex items-center py-1 px-2 bg-3 rounded-l-md border-r-0 border-gray-300 dark:border-white border"
      :class="icon"
    />
    <input
      ref="input"
      :name="name"
      :value="modelValue"
      :type="type"
      class="bg-2 input input-border text-md h-10 w-full rounded-l-none"
      :placeholder="placeholder"
      :="required ? {required: ''} : {}"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>

<script lang="js">
import { ref } from 'vue'

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'ri-stack-line'
    },
    placeholder: {
      type: String,
      default: 'Entrez du texte...'
    },
    required: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  emits: ['update:modelValue'],

  setup () {
    const input = ref(null)
    return { input }
  }
}
</script>
