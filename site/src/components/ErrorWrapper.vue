<template>
  <p
    :class="meta.valid ? 'success-message' : 'error-message' "
  >
    {{ meta.valid ? `✓ ${success}` : (error === undefined ? '' : `✗ ${error}`) }}
  </p>
</template>

<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Tag',
  props: {
    meta: {
      type: Object,
      default: () => {}
    },
    error: {
      type: String,
      default: '<Error>'
    },
    success: {
      type: String,
      default: '<Success>'
    }
  }
})
</script>
