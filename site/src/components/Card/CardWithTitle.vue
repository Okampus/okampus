<template>
  <div class="border box-card-border text-1 rounded-lg">
    <div class="font-bold bg-3 text-1 text-l p-2 px-4 align-middle text-center rounded-t-lg">
      {{ title }}
    </div>
    <div class="bg-1 p-2 px-4 rounded-b-lg">
      <slot />
    </div>
  </div>
</template>

<script lang="js">
export default {
  props: {
    title: {
      type: String,
      default: 'Placeholder'
    }
  }
}
</script>
