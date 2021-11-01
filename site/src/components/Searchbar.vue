<template>
  <div class="searchbar control has-icons-left has-icons-right">
    <input
      ref="input"
      :class="classes.join(' ')"
      :placeholder="placeholder"
      @input="displayClear"
      @focus="(e) => (e.target.placeholder = '')"
      @blur="(e) => (e.target.placeholder = placeholder)"
    >
    <span
      class="icon is-right"
      @click="clearSiblingInput"
    >
      <font-awesome-icon
        icon="times-circle"
        :style="{ color: 'var(--text-3)' }"
      />
    </span>
    <span class="icon is-left">
      <font-awesome-icon
        icon="search"
        :style="{ color: 'var(--text-3)' }"
      />
    </span>
  </div>
</template>

<script lang="js">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Searchbar',
  props: {
    classes: {
      type: Array,
      default: () => ['is-medium', 'input']
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['updateSearch'],
  methods: {
    displayClear (e) {
      const target = e.target
      const next = target.nextSibling
      this.$emit('updateSearch', target.value)
      if (target.value) {
        next.style.display = 'inline-flex'
      } else {
        next.style.display = 'none'
      }
    },

    clearSiblingInput (e) {
      const target = e.target
      const prev = target.previousSibling

      prev.value = ''
      prev.focus()
      target.style.display = 'none'
      this.$emit('updateSearch', '')
    }
  }
})
</script>

<style scoped>
.searchbar,
.searchbar input {
  width: 100%;
}

.searchbar input {
  border: 0;
  outline: 0;
  border-bottom: 2px solid var(--text-1);
  font-size: 18px;
  height: 40px;
  padding-left: 40px;
  padding-right: 30px;
}

.icon.is-left {
  font-size: 20px;
  padding-bottom: 14px;
  padding-right: 8px;
}

span.icon.is-right {
  font-size: 18px;
  padding-bottom: 8px;
  padding-left: 20px;
  cursor: pointer;
  display: none;
  pointer-events: auto;
}

span.icon.is-right svg {
  pointer-events: none;
}
</style>
