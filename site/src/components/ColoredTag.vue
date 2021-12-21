<template>
  <div
    class="
      h-7 rounded-full text-white space-x-0
      font-medium flex items-center justify-center mr-1
      px-2  bg-opacity-80 cursor-pointer hover:bg-opacity-100
      md:space-x-1 md:mr-2 md:px-4
    "
    :style="{backgroundColor: color}"
  >
    <span class="text-sm pb-1 md:text-base">
      {{ name }}
    </span>
    <slot />
  </div>
</template>

<script lang="js">
export default {
    props: {
        name: {
            type: String,
            default: '<Vide>'
        },
        color: {
            type: String,
            default: '#ef4444'
        }
    }
}
</script>
