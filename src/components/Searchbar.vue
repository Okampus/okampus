<template>
  <div class="searchbar control has-icons-left has-icons-right">
    <input
      ref="input"
      :class="classes.join(' ')"
      :placeholder="placeholder"
      v-on:input="displayClear"
      v-on:focus="(e) => (e.target.placeholder = '')"
      v-on:blur="(e) => (e.target.placeholder = placeholder)"
    />
    <span class="icon is-right" v-on:click="clearSiblingInput">
      <font-awesome-icon icon="times-circle" :style="{ color: 'var(--text-3)' }" />
    </span>
    <span class="icon is-left">
      <font-awesome-icon icon="search" :style="{ color: 'var(--text-3)' }" />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Searchbar',
  props: {
    classes: {
      default: ['is-medium', 'input']
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  methods: {
    displayClear (e: Event) {
      const target = e.target as HTMLInputElement
      const next = target.nextSibling as HTMLElement
      this.$emit('updateSearch', target.value)
      if (target.value) {
        next.style.display = 'inline-flex'
      } else {
        next.style.display = 'none'
      }
    },

    clearSiblingInput (e: Event) {
      const target = e.target as HTMLInputElement
      const prev = target.previousSibling as HTMLInputElement

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
